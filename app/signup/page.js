"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("username", form.username);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("avatar", form.avatar);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Signup failed");
      }

      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
