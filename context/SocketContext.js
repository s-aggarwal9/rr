"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io({
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) console.warn("⚠️ Socket not available yet");
  return socket;
};
