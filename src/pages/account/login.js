// pages/account/login.js

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use signIn function provided by NextAuth
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!result.ok) {
      setError(result.error || "Invalid username or password");
    } else {
      router.push("/app/dashboard"); // Redirect to dashboard on success
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Username</label>
          <Input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary">Sign In</Button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-4">
        Don't have an account?{" "}
        <Link href="/account/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
