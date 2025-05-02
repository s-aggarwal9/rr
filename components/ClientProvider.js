// components/ClientProvider.js
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

let socket;

export default function ClientProvider({ children }) {
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      path: "/api/socket",
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", "global"); // or a user-specific room
    });

    socket.on("receive-message", (msg) => {
      console.log("📩 New message:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
}
