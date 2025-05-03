// /api/chats/access/route.js
import { dbConnect } from "@/lib/db";
import { verifyJwt } from "@/lib/jwt";
import ChatModel from "@/models/Chat.model";
import UserModel from "@/models/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    const userData = await verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId } = body;
    console.log("user id in chat/access/route", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if a 1-on-1 chat already exists
    let chat = await ChatModel.findOne({
      isGroupChat: false,
      participants: { $all: [userData.id, userId], $size: 2 },
    })
      .populate("participants", "_id username email avatar")
      .populate("latestMessage");

    if (chat) {
      return NextResponse.json(chat, { status: 200 });
    }

    // Else, create new chat
    const newChat = await ChatModel.create({
      isGroupChat: false,
      participants: [userData.id, userId],
    });

    const fullChat = await ChatModel.findById(newChat._id).populate(
      "participants",
      "_id username email avatar"
    );

    return NextResponse.json(fullChat, { status: 201 });
  } catch (err) {
    console.error("Chat Access Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
