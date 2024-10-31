// /src/pages/api/employee/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { employeeID, payPeriod, payRate, payRateSchedule, effectiveDate } = req.body;

    if (!employeeID || isNaN(parseInt(employeeID))) {
      console.error("Invalid or missing employee ID:", employeeID);
      return res.status(400).json({ error: "Valid employee ID is required" });
    }

    try {
      // Retrieve timesheets for the employee on or after the effective date with valid durations
      const timesheets = await prisma.timesheet.findMany({
        where: {
          employeeID: parseInt(employeeID),
          timeIn: {
            gte: new Date(effectiveDate),
          },
          duration: {
            not: null, // Ensures only completed sessions are considered
          },
        },
        orderBy: {
          timeIn: "asc",
        },
      });

      // Group timesheets by date
      const groupedTimesheets = timesheets.reduce((acc, entry) => {
        const dateKey = entry.timeIn.toISOString().split("T")[0]; // Extract date part only
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(entry);
        return acc;
      }, {});

      const payrollRecords = [];

      // Calculate payroll for each day independently
      for (const [date, entries] of Object.entries(groupedTimesheets)) {
        // Check if a payroll record already exists for this date to avoid duplication
        const existingPayroll = await prisma.payRate.findFirst({
          where: {
            employeeID: parseInt(employeeID),
            effectiveDate: new Date(date), // Match the specific date
          },
        });

        if (existingPayroll) {
          console.log(`Payroll already exists for ${date}, skipping creation.`);
          continue; // Skip creation for this date as it already exists
        }

        let dailyHours = 0;

        entries.forEach((entry) => {
          const durationInHours = entry.duration / 3600; // Convert seconds to hours
          if (durationInHours >= 1) {
            dailyHours += durationInHours;
          } else {
            console.log(`Excluded short duration for ${date}: ${durationInHours.toFixed(2)} hours`);
          }
        });

        if (dailyHours > 0) {
          const dailyPayroll = dailyHours * payRate;
          payrollRecords.push({
            employeeID: parseInt(employeeID),
            payPeriod,
            payRate: parseFloat(payRate),
            payRateSchedule,
            effectiveDate: new Date(date), // Set to specific date
            status: "Active",
            payroll: dailyPayroll, // Store only the payroll for this day
          });
          console.log(`Payroll for ${date}: ${dailyPayroll.toFixed(2)}`);
        } else {
          console.log(`No qualifying hours for payroll on ${date}`);
        }
      }

      // Create payroll records for each date without summing them up
      const createdPayrollRecords = await Promise.all(
        payrollRecords.map(record => prisma.payRate.create({ data: record }))
      );

      console.log("Daily payroll records created:", createdPayrollRecords);
      return res.status(201).json(createdPayrollRecords);
    } catch (error) {
      console.error("Failed to create payroll records:", error);
      return res.status(500).json({ error: "Failed to create payroll records", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
