const mongoose = require("mongoose");

const hobbiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hobbies", hobbiesSchema);
