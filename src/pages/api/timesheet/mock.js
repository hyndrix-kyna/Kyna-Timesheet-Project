// /src/pages/api/timesheet/mock.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { employeeID, timeIn, timeOut, duration } = req.body;

    if (!employeeID || !timeIn || !timeOut || isNaN(duration)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const newTimesheet = await prisma.timesheet.create({
        data: {
          employeeID,
          timeIn: new Date(timeIn),
          timeOut: new Date(timeOut),
          duration,
        },
      });
      return res.status(201).json(newTimesheet);
    } catch (error) {
      console.error("Failed to create mock timesheet:", error);
      return res.status(500).json({ error: "Failed to create mock timesheet" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
