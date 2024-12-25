const express = require("express");

const signUpRouter = require("./auth.router");
const chatRouter = require("./chat.router");
const hobbiesRouter = require("./hobbies.router");
const messageRouter = require("./message.router");

const {
  checkAuthentication,
} = require("../middleware/authentication.middleware");

const router = express.Router();

router.use("/hobbies", hobbiesRouter);
router.use("/auth", signUpRouter);
router.use("/chat", checkAuthentication, chatRouter);
router.use("/message", checkAuthentication, messageRouter);

module.exports = router;
