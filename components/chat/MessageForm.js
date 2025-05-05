"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
// import { getSocket } from "@/utils/socket"; // ensure your client socket hook is here

export default function MessageForm({ chatId, sender, recipient }) {
  const [message, setMessage] = useState("");
  const socket = useSocket();

  useEffect(() => {
    //   socket.on("receive-message", ({ from, message }) => {
    //     console.log("💬 Received message from", from, ":", message);
    //   });

    socket.on("receive-message", ({ chatId, from, content }) => {
      console.log("💬 Received:", { chatId, from, content });
      // TODO: Push to state or re-fetch messages
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      chatId,
      senderId: sender,
      recipientId: recipient,
      content: message.trim(),
    };

    // console.log(
    //   "message form",
    //   newMessage,
    //   "sender",
    //   sender,
    //   "recipient",
    //   recipient,
    //   "chatId",
    //   chatId
    // );

    socket.emit("send-message", newMessage);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border rounded-md"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Send
      </button>
    </form>
  );
}
