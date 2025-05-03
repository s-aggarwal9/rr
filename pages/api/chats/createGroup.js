// pages/api/chats/create-group.js

import dbConnect from "../../../lib/dbConnect";
import Chat from "../../../models/Chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { name, participantIds } = req.body;

  if (!name || !participantIds || participantIds.length < 2) {
    return res.status(400).json({ error: "Invalid group chat data." });
  }

  try {
    await dbConnect();

    const chat = await Chat.create({
      name,
      isGroupChat: true,
      participants: participantIds,
    });

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
