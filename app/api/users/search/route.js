import { dbConnect } from "@/lib/db";
import UserModel from "@/models/User.model";
import { verifyJwt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    const userData = await verifyJwt(token);
    if (!userData)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const regex = new RegExp(query, "i");
    const users = await UserModel.find({
      _id: { $ne: userData.id },
      $or: [{ username: regex }, { email: regex }],
    }).select("username email avatar");

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
