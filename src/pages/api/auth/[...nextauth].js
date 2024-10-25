import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET, // Add this line to use the secret
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username.toLowerCase() },
          include: { Employee: true }, // Include employee data
        });

        if (!user) {
          throw new Error("No user found with this username");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid username or password");
        }

        return {
          id: user.id,
          username: user.username,
          firstName: user.Employee.firstName,
          lastName: user.Employee.lastName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/account/login",
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName; // Add first name to the token
        token.lastName = user.lastName;   // Add last name to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstName = token.firstName; // Add first name to the session
      session.user.lastName = token.lastName;   // Add last name to the session
      return session;
    },
  },
});
