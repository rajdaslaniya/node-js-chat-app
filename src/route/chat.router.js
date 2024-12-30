const express = require("express");
const {
  createChat,
  getUsers,
  getUser,
  getChatList,
  getSingleChat,
} = require("../controller/chatController");

const router = express.Router();

router.post("", createChat);
router.get("/users", getUsers);
router.get("/user", getUser);
router.get("/chats", getChatList);
router.get("/:id", getSingleChat);

module.exports = router;
