import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const decoded = verifyJwt(token);
  if (!decoded) return NextResponse.json({ user: null }, { status: 401 });

  const user = await User.findById(decoded.id).select("-password");
  return NextResponse.json({ user });
}
