// pages/api/inquiries/view/[transactionNo].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { transactionNo } = req.query;

  if (req.method === "GET") {
    try {
      const inquiry = await prisma.inquiries.findUnique({
        where: { transactionNo: transactionNo },
      });

      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      return res.status(200).json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch inquiry" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
