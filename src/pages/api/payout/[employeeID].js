// /src/pages/api/payout/[employeeID].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { employeeID } = req.query;

  if (req.method === "GET") {
    try {
      const payoutData = await prisma.payout.findMany({
        where: { employeeID: parseInt(employeeID) },
        orderBy: { payoutDate: "desc" },
      });
      res.status(200).json(payoutData);
    } catch (error) {
      console.error("Error fetching payout data:", error);
      res.status(500).json({ error: "Failed to fetch payout data." });
    }
  } else if (req.method === "POST") {
    try {
      const { payoutMode, payoutFrequency } = req.body;

      if (payoutMode === "Automatic" && payoutFrequency === "Daily") {
        // Fetch all pay rates for the employee, ordered by date
        const payRates = await prisma.payRate.findMany({
          where: {
            employeeID: parseInt(employeeID),
            status: "Active",
          },
          orderBy: { effectiveDate: "asc" },
        });

        const createdPayouts = [];
        
        for (let rate of payRates) {
          const effectiveDate = rate.effectiveDate;
          
          // Check if a payout already exists for this effective date
          const existingPayout = await prisma.payout.findFirst({
            where: {
              employeeID: parseInt(employeeID),
              payoutDate: effectiveDate,
            },
          });
          
          if (existingPayout) continue;

          // Create a daily payout record based on the pay rate
          const duration = 8; // Assuming an 8-hour workday
          const payrollAmount = duration * rate.payRate;

          const newPayout = await prisma.payout.create({
            data: {
              employeeID: parseInt(employeeID),
              payoutDate: effectiveDate,
              payoutMode,
              payoutFrequency,
              duration,
              payrollAmount,
              status: "Unpaid",
              completed: false,
            },
          });
          createdPayouts.push(newPayout);
        }

        if (createdPayouts.length > 0) {
          res.status(201).json({
            message: `${createdPayouts.length} daily payout records created.`,
            payouts: createdPayouts,
          });
        } else {
          res.status(400).json({ error: "Payouts already exist for all daily pay rate dates." });
        }
      } else if (payoutMode === "Automatic" && payoutFrequency === "Bi-Monthly") {
        // Define bi-monthly periods for each month (1-15 and 16-end of each month)
        const biMonthlyPeriods = [
          { startDay: 1, endDay: 15 },
          { startDay: 16, endDay: 0 } // 0 represents the last day of the month
        ];

        const createdPayouts = [];
        const year = new Date().getFullYear();
        const months = [9, 10, 11]; // Example months for Oct, Nov

        for (let month of months) {
          for (let period of biMonthlyPeriods) {
            const startDate = new Date(year, month, period.startDay);
            const endDate = new Date(year, month + 1, period.endDay || 0);

            // Fetch pay rates within the period's date range
            const payRates = await prisma.payRate.findMany({
              where: {
                employeeID: parseInt(employeeID),
                effectiveDate: {
                  gte: startDate,
                  lte: endDate,
                },
                status: "Active",
              },
              orderBy: { effectiveDate: "asc" },
            });

            if (payRates.length === 0) continue;

            let totalDuration = 0;
            let totalPayrollAmount = 0;

            for (let rate of payRates) {
              totalDuration += 8 * 5; // Assuming 5 workdays per week, 8 hours per day
              totalPayrollAmount += totalDuration * rate.payRate;
            }

            const existingPayout = await prisma.payout.findFirst({
              where: {
                employeeID: parseInt(employeeID),
                payoutDate: startDate,
              },
            });
            if (existingPayout) continue;

            const newPayout = await prisma.payout.create({
              data: {
                employeeID: parseInt(employeeID),
                payoutDate: startDate,
                payoutMode,
                payoutFrequency,
                startDate,
                endDate,
                duration: totalDuration,
                payrollAmount: totalPayrollAmount,
                status: "Unpaid",
                completed: false,
              },
            });
            createdPayouts.push(newPayout);
          }
        }

        if (createdPayouts.length > 0) {
          res.status(201).json({
            message: `${createdPayouts.length} bi-monthly payout records created.`,
            payouts: createdPayouts,
          });
        } else {
          res.status(400).json({ error: "Payouts already exist for all bi-monthly pay rate dates." });
        }
      } else {
        res.status(400).json({ error: "Unsupported payout mode or frequency." });
      }
    } catch (error) {
      console.error("Error creating payout records:", error);
      res.status(500).json({ error: "Failed to create payout records." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
