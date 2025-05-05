// lib/socket.js
import { Server } from "socket.io";
import { verifyJwt } from "./jwt";
import { parse } from "cookie";
import User from "@/models/User.model";

let io;

export function initSocket(server) {
  if (io) return io;

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;
      const user = await verifyJwt(token);

      if (!user || !user.id) return next(new Error("Auth error"));

      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Automatically join room with user ID
    socket.join(socket.user.id);
    console.log(`User ${socket.user.id} joined room ${socket.user.id}`);

    socket.on(
      "send-message",
      async ({ chatId, senderId, recipientId, content }) => {
        try {
          const sender = await User.findById(senderId).select(
            "username avatar"
          );

          io.to(recipientId).emit("receive-message", {
            chatId,
            from: sender._id,
            content,
            username: sender.username,
          });
        } catch (error) {
          console.error("Error in send-message handler:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
