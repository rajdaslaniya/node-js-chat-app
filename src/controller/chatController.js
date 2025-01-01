const User = require("../model/User");
const Chat = require("../model/Chat");

const createChat = async (req, res) => {
  try {
    const { chat_name, users: rawUsers } = req.body;
    const { user_id } = req;

    if (!rawUsers || !Array.isArray(rawUsers) || rawUsers.length === 0) {
      return res.status(400).json({ message: "Invalid users data" });
    }

    const sanitizedChatName = chat_name?.trim() || "";

    const uniqueUsers = Array.from(new Set([...rawUsers, user_id]));

    const existingUsers = await User.find({ _id: { $in: uniqueUsers } }).select(
      "_id"
    );
    if (existingUsers.length <= 1) {
      return res
        .status(400)
        .json({ message: "At least two valid users are required." });
    }

    const validUserIds = existingUsers.map((user) => user._id.toString());
    if (!uniqueUsers.every((id) => validUserIds.includes(id))) {
      return res.status(400).json({ message: "Invalid user IDs provided." });
    }

    const isGroup = validUserIds.length > 2;

    let chat = await Chat.findOne({
      users: { $size: validUserIds.length, $all: validUserIds },
    });

    if (!chat) {
      chat = new Chat({
        chat_name: sanitizedChatName,
        is_group: isGroup,
        users: validUserIds,
        group_admin: user_id,
      });
      await chat.save();
    }

    return res.status(200).json({
      message: chat.is_group
        ? "Group chat created successfully"
        : "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({
      message:
        error.message || "An unexpected error occurred. Please try again.",
    });
  }
};

const getChatList = async (req, res) => {
  try {
    const { user_id } = req;
    const chats = await Chat.find({ users: { $in: user_id } })
      .populate("users", ["name", "email", "avatar"])
      .populate({
        path: "latest_message",
        populate: {
          path: "sender",
          select: "name email avatar",
        },
      });
    let updated_data = JSON.parse(JSON.stringify(chats));
    updated_data = updated_data.map((chat) => {
      if (!chat.is_group) {
        return {
          ...chat,
          users: chat.users.filter((user) => user._id !== user_id),
        };
      }
      return chat;
    });
    return res
      .status(200)
      .json({ message: "Chat list data", data: updated_data });
  } catch (error) {
    console.log("getChatList  error", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const { id: chat_id } = req.params;
    const { user_id } = req;
    const chat = await Chat.findOne({ _id: chat_id }).populate("users", [
      "name",
      "email",
      "avatar",
    ]);
    if (!chat) {
      return res.status(404).json({ message: "chat does not exist" });
    }
    if (!chat.is_group) {
      let updated_data = JSON.parse(JSON.stringify(chat));
      updated_data = {
        ...updated_data,
        users: updated_data.users.filter((data) => data._id !== user_id),
      };
      return res.status(200).json({
        message: "Chat details fetched successfully",
        data: updated_data,
      });
    }
    return res
      .status(200)
      .json({ message: "Chat details fetched successfully", data: chat });
  } catch (error) {
    console.log("getChatList  error", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    let { user_id, hobbies } = req;
    hobbies = JSON.parse(JSON.stringify(hobbies));
    console.log("hobbies", hobbies);
    const users = await User.find({
      _id: { $nin: user_id },
      hobbies: { $in: hobbies },
    }).select("-password, -hobbies");
    return res
      .status(200)
      .json({ message: "User data fetched successfully", data: users });
  } catch (error) {
    console.log("getUsers  error", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { user_id } = req;
    const user = await User.findOne({ _id: user_id }).select("-password");
    return res.status(200).json({
      message: "User Detail fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error during getUser:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

module.exports = { createChat, getUsers, getUser, getChatList, getSingleChat };
