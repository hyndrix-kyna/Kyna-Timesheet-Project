import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Records array is required for inserting test data" });
    }

    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };

    // Validate each record
    for (const record of records) {
      const { employeeID, timeIn, timeOut, duration } = record;
      if (!employeeID || !timeIn || !timeOut || isNaN(duration)) {
        return res.status(400).json({ error: "Each record must have valid employeeID, timeIn, timeOut, and duration" });
      }
      if (!isValidDate(timeIn) || !isValidDate(timeOut)) {
        return res.status(400).json({ error: "Invalid date format for timeIn or timeOut" });
      }
    }

    try {
      const createdRecords = await Promise.all(
        records.map((record) =>
          prisma.timesheet.create({
            data: {
              employeeID: record.employeeID,
              timeIn: new Date(record.timeIn),
              timeOut: new Date(record.timeOut),
              duration: record.duration,
            },
          })
        )
      );

      return res.status(201).json(createdRecords);
    } catch (error) {
      console.error("Failed to create mock timesheets:", error);
      return res.status(500).json({ error: "Failed to create mock timesheets" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
