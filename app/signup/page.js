"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("username", form.username);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("avatar", avatar);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    console.log("result", result, "response", res);
    setLoading(false);

    if (res.ok) {
      alert("Signup successful!");
      router.push("/login");
    } else {
      alert(result.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-black">Signup</h1>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full"
        />
        <button
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
