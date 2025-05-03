// app/api/chats/[chatId]/messages/route.js
import { dbConnect } from "@/lib/db";
import Message from "@/models/Message.model";
import Chat from "@/models/Chat.model";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await verifyJwt(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = context.params.chatId;
    const formData = await req.formData();
    const content = formData.get("content");

    const message = await Message.create({
      chat: chatId,
      sender: user.id,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    return NextResponse.redirect(new URL(`/chats/${chatId}`, req.url));
  } catch (err) {
    console.error("Message creation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
