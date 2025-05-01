import { initSocket } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO...");
    initSocket(res.socket.server);
    res.socket.server.io = true;
  }
  res.end();
}
