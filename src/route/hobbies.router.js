const express = require("express");
const {
  createHobbies,
  getHobbies,
  updateHobbies,
} = require("../controller/hobbiesController");

const router = express.Router();

router.post("", createHobbies);
router.get("", getHobbies);

router.patch("/:id", updateHobbies);

module.exports = router;
