"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

export default function MessageForm({ chatId, sender, recipient }) {
  const [message, setMessage] = useState("");
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", ({ chatId, from, content }) => {
      console.log("💬 Received:", { chatId, from, content });
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      chatId,
      senderId: sender,
      recipientId: recipient,
      content: message.trim(),
    };

    if (socket) {
      socket.emit("send-message", newMessage);
    }

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
