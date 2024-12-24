const express = require("express");
const signUp = require("./auth.router");
const router = express.Router();

const hobbiesRouter = require("./hobbies.router");
router.use("/hobbies", hobbiesRouter);
router.use("/auth", signUp);

module.exports = router;
