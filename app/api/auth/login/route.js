import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signJwt({ id: user._id });

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ message: "Login successful" });
}
