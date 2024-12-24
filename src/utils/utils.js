const jwt = require("jsonwebtoken");
const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET);
};

module.exports = {
  createToken,
};
