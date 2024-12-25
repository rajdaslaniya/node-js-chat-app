const express = require("express");
const { createChat, getUsers } = require("../controller/chatController");

const router = express.Router();

router.post("", createChat);
router.get("/users", getUsers);

module.exports = router;
