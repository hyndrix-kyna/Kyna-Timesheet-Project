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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-background p-8 border border-border rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-8">Sign In</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg dark:border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg dark:border-gray-300"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 mt-4 bg-gray-800 text-white dark:bg-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors rounded-lg"
          >
            Sign In
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link href="/account/signup" className="text-blue-500 hover:underline">
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  );
}
