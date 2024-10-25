import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const payRates = await prisma.payRate.findMany({
        where: { employeeID: parseInt(id) },
        orderBy: { effectiveDate: "desc" },
      });
      return res.status(200).json(payRates);
    } catch (error) {
      console.error("Failed to fetch pay rate history:", error);
      return res.status(500).json({ error: "Failed to fetch pay rate history" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
