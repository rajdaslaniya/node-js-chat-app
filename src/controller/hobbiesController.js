const Hobbies = require("../model/Hobbies");

const createHobbies = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    name = name.trim();

    const checkIsPresent = await Hobbies.findOne({ name });
    if (checkIsPresent) {
      return res.status(400).json({ message: "Hobbies already present" });
    }

    const hobbies = new Hobbies({ name });
    await hobbies.save();
    return res
      .status(200)
      .json({ message: "Hobbies created successfully", data: hobbies });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Some thing went to wrong please try again",
    });
  }
};

const getHobbies = async (req, res) => {
  try {
    const hobbies = await Hobbies.find({});
    return res
      .status(200)
      .json({ message: "Hobbies created successfully", data: hobbies });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Some thing went to wrong please try again",
    });
  }
};

const updateHobbies = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    name = name.trim();

    const checkIsPresent = await Hobbies.findOne({ name });
    if (checkIsPresent) {
      return res.status(400).json({ message: "Hobbies already present" });
    }

    const data = await Hobbies.findByIdAndUpdate(
      { _id: id },
      { name },
      { runValidators: true, returnDocument: "after" }
    );
    if (!data) {
      return res.status(400).json({ message: "Hobbies not found" });
    }
    return res
      .status(200)
      .json({ message: "Hobbies updated successfully", data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Some thing went to wrong please try again",
    });
  }
};

module.exports = { createHobbies, getHobbies, updateHobbies };
