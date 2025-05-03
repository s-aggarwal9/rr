// app/chats/page.js
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { dbConnect } from "@/lib/db";
import Chat from "@/models/Chat.model";
import User from "@/models/User.model";
import Message from "@/models/Message.model";
import Link from "next/link";

export default async function ChatsPage() {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // const token = await cookies().get("token")?.value;
  const userData = await verifyJwt(token);

  if (!userData) {
    return (
      <div className="text-center mt-10 text-red-500">
        Please log in to view your chats.
        <Link href={"/login"}>Login</Link>
      </div>
    );
  }

  const chats = await Chat.find({ participants: userData.id })
    .populate("participants", "username email avatar")
    .populate("latestMessage");

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Chats</h1>
        <div className="space-y-4">
          {chats.map((chat) => {
            const isGroup = chat.isGroupChat;
            const otherUser = chat.participants.find(
              (u) => u._id.toString() !== userData.id
            );

            return (
              <Link
                key={chat._id}
                href={`/chats/${chat._id}`}
                className="block p-4 bg-white rounded shadow hover:bg-gray-50"
              >
                <div className="font-semibold text-lg">
                  {isGroup ? chat.groupName : otherUser?.username}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {chat.latestMessage?.content || "No messages yet."}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
