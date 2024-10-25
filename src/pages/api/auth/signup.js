// pages/api/auth/signup.js

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating a 6-character unique ID

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, gender, username, password } = req.body;

    try {
      // Step 1: Generate a 6-character unique employee number using UUID
      const employeeNo = uuidv4().slice(0, 6); // Take the first 6 characters of the UUID

      // Step 2: Create an employee entry
      const newEmployee = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          gender,
          employeeNo, // Store the generated employee number
        },
      });

      // Step 3: Create a user and associate it with the employee
      const newUser = await prisma.user.create({
        data: {
          username,
          password, // The password should already be hashed in your sign-up form before sending here
          status: "active",
          employeeID: newEmployee.id, // Link to the employee
        },
      });

      return res.status(201).json({ newEmployee, newUser });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create user and employee", error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
