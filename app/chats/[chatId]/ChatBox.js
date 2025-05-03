"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/utils/socket";
import axios from "axios";

export default function ChatBox({ chatId, userId, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const socket = useRef(getSocket());
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.current.emit("join", chatId);

    socket.current.on("receive-message", (data) => {
      console.log("📨 New message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.current.off("receive-message");
    };
  }, [chatId]);

  useEffect(() => {
    // Auto scroll to bottom on new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const res = await axios.post(`/api/chats/${chatId}/messages`, {
        content,
      });

      const message = res.data;

      setMessages((prev) => [...prev, message]);

      socket.current.emit("send-message", {
        to: chatId,
        message,
      });

      setContent("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 rounded ${
            msg.sender._id === userId
              ? "bg-blue-100 text-right"
              : "bg-gray-100 text-left"
          }`}
        >
          <div className="text-xs text-black">{msg.sender.username}</div>
          <div className="text-black">{msg.content}</div>
        </div>
      ))}
      <div ref={scrollRef}></div>

      <div className="mt-4 flex">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border px-3 py-2 rounded-l"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
