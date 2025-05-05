"use client";

import React, { useEffect, useState } from "react";
import { getSocket } from "@/utils/socket";
// import Message from "@/models/Message.model";

const MessageList = ({ chatId, userId, initialMessages }) => {
  //   const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const socket = getSocket();

  useEffect(() => {
    console.log("messageList socket", socket);
    if (!socket) return;

    socket.emit("join-room", chatId);

    socket.on(
      "receive-message",
      ({ chatId: socketChatId, from, content, username }) => {
        console.log(
          "socket on recieve console",
          socketChatId,
          from,
          content,
          chatId
        );
        if (socketChatId === chatId) {
          console.log("updating messages");
          setMessages((prev) => [
            ...prev,
            {
              sender: { _id: from, username },
              content,
              _id: messages.length + 1,
            },
          ]);
        }
      }
    );

    return () => {
      socket.off("new-message");
      socket.emit("leave-room", chatId);
    };
  }, [chatId]);

  //   console.log(chatId, userId, initialMessages);

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 rounded ${
            msg.sender._id.toString() === userId
              ? "bg-blue-100 text-right"
              : "bg-gray-200 text-left"
          }`}
        >
          <div className="text-xs text-gray-600">{msg.sender.username}</div>
          <div className="text-black">{msg.content}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
