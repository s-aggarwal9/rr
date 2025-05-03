// pages/api/users/search.js

import { dbConnect } from "../../../lib/db";
import User from "../../../models/User.model";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    await dbConnect();

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    }).select("username _id");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
