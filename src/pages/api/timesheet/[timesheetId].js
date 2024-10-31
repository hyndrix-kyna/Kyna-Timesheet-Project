// /src/pages/api/timesheet/[timesheetId].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { timesheetId } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(timesheetId) },
      include: { Employee: true },
    });

    if (!user || !user.Employee) {
      return res.status(400).json({ error: "User or associated employee not found" });
    }

    const employeeID = user.Employee.id;

    if (req.method === "POST") {
      const { action } = req.body;

      const activeTimesheet = await prisma.timesheet.findFirst({
        where: { employeeID: employeeID, timeOut: null },
      });

      if (!activeTimesheet && action === "timeIn") {
        const newTimesheet = await prisma.timesheet.create({
          data: { employeeID: employeeID, timeIn: new Date() },
        });
        return res.status(200).json(newTimesheet);
      }

      if (activeTimesheet) {
        if (action === "breakStart" && !activeTimesheet.breakStart) {
          const updatedTimesheet = await prisma.timesheet.update({
            where: { id: activeTimesheet.id },
            data: { breakStart: new Date() },
          });
          return res.status(200).json(updatedTimesheet);
        }

        if (action === "breakEnd" && activeTimesheet.breakStart && !activeTimesheet.breakEnd) {
          const updatedTimesheet = await prisma.timesheet.update({
            where: { id: activeTimesheet.id },
            data: { breakEnd: new Date() },
          });
          return res.status(200).json(updatedTimesheet);
        }

        if (action === "timeOut" && !activeTimesheet.timeOut) {
          const timeOut = new Date();
          const duration = Math.floor((timeOut - new Date(activeTimesheet.timeIn)) / 1000); // Calculate duration in seconds

          const updatedTimesheet = await prisma.timesheet.update({
            where: { id: activeTimesheet.id },
            data: {
              timeOut,
              duration,
            },
          });
          return res.status(200).json(updatedTimesheet);
        }
      }

      return res.status(400).json({ error: "Invalid action or state" });
    }

    if (req.method === "GET") {
      const allTimesheets = await prisma.timesheet.findMany({
        where: { employeeID: employeeID },
        orderBy: { timeIn: "desc" }, // Ensure descending order
      });

      const activeSession = await prisma.timesheet.findFirst({
        where: { employeeID: employeeID, timeOut: null },
      });

      return res.status(200).json({ all: allTimesheets, current: activeSession });
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Failed to process timesheet:", error);
    return res.status(500).json({ error: "Failed to process timesheet", details: error.message });
  }
}
