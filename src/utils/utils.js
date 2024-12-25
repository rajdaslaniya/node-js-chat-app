const jwt = require("jsonwebtoken");
const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
};
