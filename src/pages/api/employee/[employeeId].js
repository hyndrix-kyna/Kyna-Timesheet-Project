// /pages/api/employee/[employeeId].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { employeeId } = req.query;

  if (req.method === "GET") {
    try {
      const employeeID = parseInt(employeeId);
      if (isNaN(employeeID)) {
        console.error("Invalid employee ID:", employeeId);
        return res.status(400).json({ error: "Invalid employee ID" });
      }

      const payRates = await prisma.payRate.findMany({
        where: { employeeID },
        orderBy: { effectiveDate: "desc" },
      });

      return res.status(200).json(payRates);
    } catch (error) {
      console.error("Error fetching pay rate history:", error.message);
      return res.status(500).json({ error: "Failed to fetch pay rate history", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
