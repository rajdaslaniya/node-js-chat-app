const User = require("../model/User");
const { verifyToken } = require("../utils/utils");

const checkAuthentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const { email, id } = verifyToken(authorization);
    const user = await User.find({ email, _id: id });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized to perform this task",
      });
    }
    req.user_id = id;
    req.email = email;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized to perform this task",
    });
  }
};

module.exports = {
  checkAuthentication,
};
