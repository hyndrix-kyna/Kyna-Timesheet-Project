// /src/pages/api/inquiries/update/[transactionNo].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { transactionNo } = req.query;

  if (req.method === "PUT") {
    try {
      const updatedInquiry = await prisma.inquiries.update({
        where: { transactionNo },
        data: req.body, // req.body should contain the updated fields
      });

      return res.status(200).json(updatedInquiry);
    } catch (error) {
      console.error("Failed to update inquiry:", error);
      return res.status(500).json({ error: "Failed to update inquiry" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
