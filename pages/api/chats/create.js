// pages/api/chats/create.js

import dbConnect from "../../../lib/dbConnect";
import Chat from "../../../models/Chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2) {
    return res.status(400).json({ error: "Both user IDs are required." });
  }

  try {
    await dbConnect();

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2], $size: 2 },
    });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({ participants: [userId1, userId2] });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
