const User = require("../model/User");
const Hobbies = require("../model/Hobbies");
const { createToken } = require("../utils/utils");

const signUp = async (req, res) => {
  try {
    let { name, email, avatar, password, hobbies } = req.body;

    name = name?.trim();
    email = email?.trim();
    avatar = avatar?.trim();
    password = password;

    if (
      !name ||
      !email ||
      !avatar ||
      !password ||
      !Array.isArray(hobbies) ||
      hobbies.length === 0
    ) {
      return res.status(400).json({ message: "Please provide valid data" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    hobbies = [...new Set(hobbies)];
    const matchingItems = await Hobbies.find({ _id: { $in: hobbies } }).select(
      "_id"
    );
    const validHobbyIds = matchingItems.map((item) => item._id.toString());

    if (!hobbies.every((id) => validHobbyIds.includes(id))) {
      return res.status(400).json({ message: "Invalid hobbies data" });
    }

    const user = new User({
      name,
      email,
      password,
      avatar,
      hobbies,
    });

    const savedUser = await user.save();

    return res.status(200).json({
      message: "Sign up successful",
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Please provide valid email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const token = createToken(user.email, user._id);

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong. Please try again.",
    });
  }
};

module.exports = {
  signUp,
  login,
};
