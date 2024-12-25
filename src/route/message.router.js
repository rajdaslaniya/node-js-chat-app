const express = require("express");
const { addMessage, getMessage } = require("../controller/messageController");

const router = express.Router();

router.post("/:id", addMessage);
router.get("/:id", getMessage);

module.exports = router;
