const express = require("express");
const { signUp } = require("../controller/authController");
const {
  createHobbies,
  getHobbies,
  updateHobbies,
} = require("../controller/hobbiesController");
const router = express.Router();

router.get("/sign-up", signUp);
router.post("/create-hobbies", createHobbies);
router.get("/hobbies", getHobbies);

router.patch("/hobbies/:id", updateHobbies);

module.exports = router;
