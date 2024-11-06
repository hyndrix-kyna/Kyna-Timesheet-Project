// /src/pages/api/employee/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { employeeID, payRate, payRateSchedule, effectiveDate } = req.body;

    if (!employeeID || isNaN(parseInt(employeeID))) {
      console.error("Invalid or missing employee ID:", employeeID);
      return res.status(400).json({ error: "Valid employee ID is required" });
    }

    try {
      const dateToProcess = new Date(effectiveDate);
      const nextDay = new Date(dateToProcess);
      nextDay.setDate(nextDay.getDate() + 1);

      // Retrieve timesheets only for the exact date chosen by the user
      const timesheets = await prisma.timesheet.findMany({
        where: {
          employeeID: parseInt(employeeID),
          timeIn: {
            gte: dateToProcess,
            lt: nextDay, // Only fetch timesheets within the selected day
          },
          duration: {
            not: null, // Ensures only completed sessions are considered
          },
        },
        orderBy: {
          timeIn: "asc",
        },
      });

      if (!timesheets.length) {
        console.log(`No timesheet entries found for the date: ${effectiveDate}`);
        return res.status(404).json({ error: `No timesheet entries found for the selected date: ${effectiveDate}` });
      }

      // Check if a payroll record already exists for this date to avoid duplication
      const existingPayroll = await prisma.payRate.findFirst({
        where: {
          employeeID: parseInt(employeeID),
          effectiveDate: dateToProcess,
        },
      });

      if (existingPayroll) {
        console.log(`Payroll already exists for ${effectiveDate}, skipping creation.`);
        return res.status(409).json({ error: `Payroll record already exists for the date: ${effectiveDate}` });
      }

      // Calculate total hours for the day
      let dailyHours = 0;

      timesheets.forEach((entry) => {
        const durationInHours = entry.duration / 3600; // Convert seconds to hours
        if (durationInHours >= 1) {
          dailyHours += durationInHours;
        } else {
          console.log(`Excluded short duration for ${effectiveDate}: ${durationInHours.toFixed(2)} hours`);
        }
      });

      if (dailyHours > 0) {
        const dailyPayroll = dailyHours * payRate;
        const newPayrollRecord = await prisma.payRate.create({
          data: {
            employeeID: parseInt(employeeID),
            payRate: parseFloat(payRate),
            payRateSchedule,
            effectiveDate: dateToProcess,
            status: "Active",
            payroll: dailyPayroll,
          },
        });
        console.log(`Payroll for ${effectiveDate}: ${dailyPayroll.toFixed(2)}`);
        return res.status(201).json(newPayrollRecord);
      } else {
        console.log(`No qualifying hours for payroll on ${effectiveDate}`);
        return res.status(404).json({ error: `No qualifying hours for payroll on the selected date: ${effectiveDate}` });
      }
    } catch (error) {
      console.error("Failed to create payroll record:", error);
      return res.status(500).json({ error: "Failed to create payroll record", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
