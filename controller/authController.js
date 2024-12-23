const User = require("../model/User");

const signUp = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    const user = new User({
      name,
      email,
      age,
      password,
    });

    await user.save();

    return res.status(200).json({ message: "Sign up successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Some thing went to wrong please try again",
      });
  }
};

module.exports = {
  signUp,
};
