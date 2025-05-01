"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
  path: "/api/socket",
  withCredentials: true,
  autoConnect: false,
});

export default function ClientProvider({ children }) {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  return <>{children}</>;
}
