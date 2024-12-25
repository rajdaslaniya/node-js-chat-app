const Message = require("../model/Message");
const Chat = require("../model/Chat");

const addMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const { id: chatId } = req.params;

    if (!sender || !message || !chatId) {
      return res.status(400).json({
        message: "Invalid data. Required fields: sender, message, and chatId.",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, users: { $in: sender } });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Invalid chat ID or user is not part of this chat." });
    }

    const newMessage = new Message({
      chat_id: chatId,
      sender,
      message,
    });

    await newMessage.save();

    return res.status(200).json({
      message: "Message added successfully.",
      data: newMessage,
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
      .sort({ createdAt: -1 })
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
