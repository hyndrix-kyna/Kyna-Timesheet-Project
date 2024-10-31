// /pages/account/signup.js

import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          gender,
          username,
          password: hashedPassword,
        }),
      });

      if (res.ok) {
        router.push("/account/login");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create account");
      }
    } catch (error) {
      setError("An error occurred during signup");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="bg-background border border-border rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>First Name</label>
            <Input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <label>Last Name</label>
            <Input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male" className="dark:text-black">Male</option>
              <option value="Female" className="dark:text-black">Female</option>
              <option value="Other" className="dark:text-black">Other</option>
            </select>
          </div>
          <div>
            <label>Username</label>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <label>Password</label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="dark:border-gray-300"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2 bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-300"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/account/login" className="text-blue-500 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
