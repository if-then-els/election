const express = require("express");
const User = require("../models/users");
const Candidate = require("../models/candidates");

const router = express.Router();

// Controller for handling voting
exports.vote = async (req, res) => {
  try {
    const { userId, candidateId } = req.body;

    // Check if user has already voted
    const user = await User.findById(userId);
    if (user.hasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    // Update user's voting status
    user.hasVoted = true;
    await user.save();

    // Update candidate's vote count
    const candidate = await Candidate.findById(candidateId);
    candidate.votes += 1;
    await candidate.save();

    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
