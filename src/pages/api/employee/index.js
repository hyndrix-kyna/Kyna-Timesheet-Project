// /pages/api/employee/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { employeeID, payPeriod, payRate, payRateSchedule, effectiveDate } = req.body;

    if (!employeeID) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    try {
      const payRateRecord = await prisma.payRate.create({
        data: {
          employeeID: parseInt(employeeID),
          payPeriod,
          payRate: parseFloat(payRate), // Ensure payRate is a float or number
          payRateSchedule,
          effectiveDate: new Date(effectiveDate),
          status: "Active", // Assuming status is always "Active"
          // Connect existing employee
          Employee: {
            connect: { id: employeeID},
          },
        },
      });
      res.status(201).json(payRateRecord);
    } catch (error) {
      console.error("Failed to create pay rate:", error);
      res.status(500).json({ error: "Failed to create pay rate", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
