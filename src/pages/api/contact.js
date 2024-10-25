// pages/api/inquiries.js
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, contactNo, emailAddress, subject, message } = req.body;

    try {
      const inquiry = await prisma.inquiries.create({
        data: {
          transactionNo: uuid(),
          firstName,
          lastName,
          contactNo,
          emailAddress,
          subject,
          message,
          status: "pending", // default status
        },
      });

      return res.status(201).json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: "Failed to submit inquiry" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}