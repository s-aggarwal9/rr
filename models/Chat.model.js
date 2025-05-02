import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String },
    groupAvatar: { type: String },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
