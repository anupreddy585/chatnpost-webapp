// models/chatdata.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false, // 👈 new field for tracking read/unread
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
