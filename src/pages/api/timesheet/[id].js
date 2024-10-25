import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // This is the User ID (from session.user.id)

  try {
    // Fetch the associated employeeID using the User record
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { Employee: true }, // Fetch related Employee
    });

    if (!user || !user.Employee) {
      return res.status(400).json({ error: "User or associated employee not found" });
    }

    const employeeID = user.Employee.id; // Get the employee ID

    if (req.method === "POST") {
      const { action } = req.body;

      // Fetch the employee's current active timesheet
      const activeTimesheet = await prisma.timesheet.findFirst({
        where: { employeeID: employeeID, timeOut: null }, // Active timesheet (not yet clocked out)
      });

      if (!activeTimesheet && action === "timeIn") {
        const newTimesheet = await prisma.timesheet.create({
          data: {
            employeeID: employeeID,
            timeIn: new Date(),
          },
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
          const updatedTimesheet = await prisma.timesheet.update({
            where: { id: activeTimesheet.id },
            data: { timeOut: new Date() },
          });
          return res.status(200).json(updatedTimesheet);
        }
      }

      return res.status(400).json({ error: "Invalid action or state" });
    }

    // Handle GET to fetch all timesheets for the current day
    if (req.method === "GET") {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const allTimesheets = await prisma.timesheet.findMany({
        where: {
          employeeID: employeeID,
          timeIn: {
            gte: today, // Get timesheets starting from the beginning of the current day
          },
        },
      });

      return res.status(200).json({ all: allTimesheets });
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Failed to process timesheet:", error);
    return res.status(500).json({ error: "Failed to process timesheet", details: error.message });
  }
}
