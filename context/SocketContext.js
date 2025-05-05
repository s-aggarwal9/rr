// context/SocketContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext); // This will allow any component to access the socket instance
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only establish the socket connection once when the component is mounted
    const socketInstance = io({
      path: "/api/socket", // Match with the server path
      withCredentials: true,
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect(); // Clean up the socket connection when component unmounts
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children} {/* Your app content */}
    </SocketContext.Provider>
  );
}
