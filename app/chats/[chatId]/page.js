// app/chats/[chatId]/page.js

import { dbConnect } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import Chat from "@/models/Chat.model";
import Message from "@/models/Message.model";
import User from "@/models/User.model";
import dynamic from "next/dynamic";

export default async function ChatPage({ params }) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const userData = await verifyJwt(token);
  const { chatId } = await params; // Await params to resolve chatId

  const MessageForm = dynamic(() => import("@/components/chat/MessageForm"));

  if (!userData) {
    return <div className="text-center mt-10 text-red-500">Unauthorized</div>;
  }

  const chat = await Chat.findById(chatId)
    .populate("participants", "username avatar")
    .lean();

  if (
    !chat ||
    !chat.participants.some((u) => u._id.toString() === userData.id)
  ) {
    return (
      <div className="text-center mt-10 text-red-500">
        Chat not found or access denied
      </div>
    );
  }

  const messages = await Message.find({ chat: chat._id })
    .populate("sender", "username avatar")
    .sort({ createdAt: 1 })
    .lean();

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-4">
        <h1 className="text-xl font-bold mb-4">
          {chat.isGroupChat
            ? chat.groupName
            : chat.participants.find((u) => u._id.toString() !== userData.id)
                ?.username}
        </h1>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded ${
                msg.sender._id.toString() === userData.id
                  ? "bg-blue-100 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              <div className="text-xs text-gray-600">{msg.sender.username}</div>
              <div className="text-black">{msg.content}</div>
            </div>
          ))}
        </div>
        <MessageForm
          chatId={chat._id.toString()}
          sender={userData.id.toString()}
          recipient={chat.participants
            .find((p) => p._id.toString() !== userData.id)
            ._id.toString()}
        />

        {/* <form
          action={`/api/chats/${chat._id}/messages`}
          method="POST"
          className="mt-4 flex"
        >
          <input
            name="content"
            required
            placeholder="Type a message..."
            className="flex-1 border px-3 py-2 rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </form> */}
      </div>
    </main>
  );
}
