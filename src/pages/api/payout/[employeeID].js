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
        // Daily payout logic as it currently exists
        const payRates = await prisma.payRate.findMany({
          where: {
            employeeID: parseInt(employeeID),
            status: "Active",
          },
          orderBy: { effectiveDate: "asc" },
        });

        let createdPayouts = [];
        for (let payRate of payRates) {
          const existingPayout = await prisma.payout.findFirst({
            where: {
              employeeID: parseInt(employeeID),
              payoutDate: payRate.effectiveDate,
            },
          });

          if (existingPayout) continue;

          const duration = 8; // 8 hours per day
          const payrollAmount = duration * payRate.payRate;

          const newPayout = await prisma.payout.create({
            data: {
              employeeID: parseInt(employeeID),
              payoutDate: payRate.effectiveDate,
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
            message: `${createdPayouts.length} payout records created.`,
            payouts: createdPayouts,
          });
        } else {
          res.status(400).json({ error: "Payouts already exist for all pay rate dates." });
        }
      } else if (payoutMode === "Automatic" && payoutFrequency === "Bi-Monthly") {
        // Bi-Monthly payout logic
        const payRates = await prisma.payRate.findMany({
          where: {
            employeeID: parseInt(employeeID),
            status: "Active",
          },
          orderBy: { effectiveDate: "asc" },
        });

        const createdPayouts = [];
        for (let payRate of payRates) {
          const payoutDates = [
            new Date(payRate.effectiveDate.getFullYear(), payRate.effectiveDate.getMonth(), 15),
            new Date(payRate.effectiveDate.getFullYear(), payRate.effectiveDate.getMonth() + 1, 0), // Last day of the month
          ];

          for (let date of payoutDates) {
            const existingPayout = await prisma.payout.findFirst({
              where: {
                employeeID: parseInt(employeeID),
                payoutDate: date,
              },
            });

            if (existingPayout) continue;

            const duration = 8 * 15; // 15 workdays bi-monthly as an example
            const payrollAmount = duration * payRate.payRate;

            const newPayout = await prisma.payout.create({
              data: {
                employeeID: parseInt(employeeID),
                payoutDate: date,
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
        }

        if (createdPayouts.length > 0) {
          res.status(201).json({
            message: `${createdPayouts.length} bi-monthly payout records created.`,
            payouts: createdPayouts,
          });
        } else {
          res.status(400).json({ error: "Payouts already exist for the latest bi-monthly dates." });
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
