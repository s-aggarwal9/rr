import mongoose from "mongoose";
import User from "./User.model";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String },
    groupAvatar: { type: String },
    groupDescription: { type: String }, // optional future use
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
