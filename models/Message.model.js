import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    attachment: { type: String }, // Cloudinary URL (if any)
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      {
        emoji: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
