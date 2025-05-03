"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/utils/socket";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      if (res.ok) {
        console.log("login success, pushing to chat");

        const socket = getSocket();

        socket.on("connect", () => {
          console.log("Socket connected after login:", socket.id);
        });
        router.push("/chat");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // wherever you handle login (e.g., in LoginForm.js)

  // const handleLogin = async (formData) => {
  //   const res = await fetch("/api/auth/login", {
  //     method: "POST",
  //     body: JSON.stringify(formData),
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   if (res.ok) {
  //     console.log("Login success");

  //     // optional: navigate or show dashboard
  //   } else {
  //     const err = await res.json();
  //     console.error("Login failed", err);
  //   }
  // };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const res = await fetch("/api/auth/login", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password }),
  //       });

  //       const data = await res.json();

  //       if (!res.ok) throw new Error(data.message || "Login failed");

  //       router.push("/chat"); // or wherever
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
