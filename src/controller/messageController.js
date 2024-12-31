const Message = require("../model/Message");
const Chat = require("../model/Chat");
const { io } = require("../socket/socket");

const addMessage = async (req, res) => {
  try {
    const { user_id } = req;
    const { message } = req.body;
    const { id: chatId } = req.params;

    if (!message || !chatId) {
      return res.status(400).json({
        message: "Invalid data. Required fields: message, and chatId.",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, users: { $in: user_id } });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Invalid chat ID or user is not part of this chat." });
    }

    const newMessage = new Message({
      chat_id: chatId,
      sender: user_id,
      message,
    });

    await newMessage.save();

    const newMessageData = await Message.findOne({
      _id: newMessage._id,
    })
      .select(["sender", "message", "createdAt", "updatedAt"])
      .populate("sender", ["email", "name", "avatar"]);

    await Chat.findByIdAndUpdate(chatId, { latest_message: newMessage._id });

    io.to(chatId).emit("receiveNewMessage", {
      data: newMessageData,
    });
    return res.status(200).json({
      message: "Message added successfully.",
      data: newMessageData,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({
      message:
        error.message || "An unexpected error occurred. Please try again.",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { user_id } = req;
    if (!chatId) {
      return res.status(400).json({
        message: "Invalid data. Required fields: chatId.",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, users: { $in: user_id } });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Invalid chat ID or user is not part of this chat." });
    }

    const messages = await Message.find({
      chat_id: chatId,
    })
      .sort({ createdAt: 1 })
      .select(["sender", "message", "createdAt", "updatedAt"])
      .populate("sender", ["email", "name", "avatar"]);

    return res.status(200).json({
      message: "Message fetched successfully.",
      data: messages,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({
      message:
        error.message || "An unexpected error occurred. Please try again.",
    });
  }
};

module.exports = { addMessage, getMessage };
