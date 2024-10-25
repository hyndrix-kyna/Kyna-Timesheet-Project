import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // Fetch user data along with employee details
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          Employee: true, // Include the associated Employee details
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Combine user and employee data
      const userDetails = {
        username: user.username,
        status: user.status,
        firstName: user.Employee?.firstName || "",
        lastName: user.Employee?.lastName || "",
        gender: user.Employee?.gender || "",
        employeeNo: user.Employee?.employeeNo || "",
      };

      return res.status(200).json(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ error: "Failed to fetch user details" });
    }
  } 
  
  if (req.method === "PUT") {
    const { firstName, lastName, gender, status, username, password, currentPassword } = req.body;

    try {
      // Fetch user and related employee details
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { Employee: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user is updating any fields other than the password
      if (firstName || lastName || gender || status || username) {
        // Validate current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(403).json({ error: "Invalid current password" });
        }

        // Update Employee details
        await prisma.employee.update({
          where: { id: user.employeeID },
          data: {
            firstName: firstName || user.Employee.firstName,
            lastName: lastName || user.Employee.lastName,
            gender: gender || user.Employee.gender,
          },
        });

        // Update User details
        await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
            status: status || user.status,
            username: username || user.username,
          },
        });
      }

      // Check if the user wants to update their password
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: parseInt(id) },
          data: { password: hashedPassword },
        });
      }

      return res.status(200).json({ message: "Account updated successfully" });
    } catch (error) {
      console.error("Error updating user details:", error);
      return res.status(500).json({ error: "Failed to update account" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
