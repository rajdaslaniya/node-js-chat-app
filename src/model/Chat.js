const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9790/9790561.png",
    },
    chat_name: {
      type: String,
    },
    is_group: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latest_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    group_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
