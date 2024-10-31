// /src/pages/api/employee/[employeeId].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { employeeId, payPeriod } = req.query;

  if (req.method === "GET") {
    try {
      const employeeID = parseInt(employeeId);
      if (isNaN(employeeID)) {
        console.error("Invalid employee ID:", employeeId);
        return res.status(400).json({ error: "Invalid employee ID" });
      }

      // Fetch pay rate records and order by effective date in descending order
      const payRates = await prisma.payRate.findMany({
        where: { employeeID },
        orderBy: { effectiveDate: "desc" },
      });

      let groupedPayRates = [];
      if (payPeriod === "Weekly") {
        groupedPayRates = groupByWeek(payRates);
      } else if (payPeriod === "Monthly") {
        groupedPayRates = groupByMonth(payRates);
      } else {
        // Default to daily view, with effective date formatted and records sorted in descending order
        groupedPayRates = payRates.map((record) => ({
          ...record,
          effectiveDate: new Date(record.effectiveDate).toLocaleDateString("en-US"),
        }));
      }

      return res.status(200).json(groupedPayRates);
    } catch (error) {
      console.error("Error fetching pay rate history:", error.message);
      return res.status(500).json({ error: "Failed to fetch pay rate history", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// Helper function to group records by week
function groupByWeek(payRates) {
  const grouped = [];
  let weekGroup = [];
  let currentWeek = getWeek(payRates[0].effectiveDate);

  payRates.forEach((record) => {
    const recordWeek = getWeek(record.effectiveDate);
    if (recordWeek === currentWeek) {
      weekGroup.push(record);
    } else {
      grouped.push(aggregateGroup(weekGroup, "Weekly"));
      weekGroup = [record];
      currentWeek = recordWeek;
    }
  });

  if (weekGroup.length > 0) grouped.push(aggregateGroup(weekGroup, "Weekly"));
  return grouped;
}

// Helper function to group records by month
function groupByMonth(payRates) {
  const grouped = [];
  let monthGroup = [];
  let currentMonth = new Date(payRates[0].effectiveDate).getMonth();

  payRates.forEach((record) => {
    const recordMonth = new Date(record.effectiveDate).getMonth();
    if (recordMonth === currentMonth) {
      monthGroup.push(record);
    } else {
      grouped.push(aggregateGroup(monthGroup, "Monthly"));
      monthGroup = [record];
      currentMonth = recordMonth;
    }
  });

  if (monthGroup.length > 0) grouped.push(aggregateGroup(monthGroup, "Monthly"));
  return grouped;
}

// Aggregate function to sum up payroll and set date ranges/rate ranges within a group
function aggregateGroup(records, period) {
  const payrollTotal = records.reduce((sum, record) => sum + record.payroll, 0);

  // Determine the effective date range
  let effectiveDate;
  if (period === "Weekly") {
    const startDate = new Date(records[records.length - 1].effectiveDate);
    const endDate = new Date(records[0].effectiveDate);
    if (!isNaN(startDate) && !isNaN(endDate)) {
      effectiveDate = `${startDate.toLocaleDateString("en-US")} - ${endDate.toLocaleDateString("en-US")}`;
    } else {
      effectiveDate = "Invalid Date";
    }
  } else if (period === "Monthly") {
    const month = new Date(records[0].effectiveDate).toLocaleString("en-US", { month: 'long' });
    const year = new Date(records[0].effectiveDate).getFullYear();
    effectiveDate = `${month} ${year}`;
  } else {
    effectiveDate = new Date(records[0].effectiveDate).toLocaleDateString("en-US");
  }

  // Determine the pay rate range
  const uniqueRates = [...new Set(records.map(record => record.payRate))];
  const payRate = uniqueRates.length > 1 ? `${Math.min(...uniqueRates)} - ${Math.max(...uniqueRates)}` : uniqueRates[0];

  return {
    status: records[0].status,
    payRate: payRate,
    payRateSchedule: records[0].payRateSchedule,
    effectiveDate,
    payroll: payrollTotal,
  };
}



// Helper function to get week number
function getWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
