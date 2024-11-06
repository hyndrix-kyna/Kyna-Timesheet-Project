import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const inquiry = await prisma.inquiry.findUnique({
        where: { transactionNo: id },
      });

      if (inquiry) {
        res.status(200).json(inquiry);
      } else {
        res.status(404).json({ message: "Inquiry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching inquiry details" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
