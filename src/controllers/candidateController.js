const Candidate = require("../models/candidates");

// Controller for adding a candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, position } = req.body;
    const newCandidate = new Candidate({ name, position });
    await newCandidate.save();
    res.status(200).json({ message: "Candidate added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
