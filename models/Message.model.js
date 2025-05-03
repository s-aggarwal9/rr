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
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      {
        emoji: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

// Ensure either content or attachment is present
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.attachment) {
    this.invalidate("content", "Message must have either text or attachment.");
  }
  next();
});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
