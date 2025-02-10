const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/users");
const Candidate = require("../models/candidates");

const router = express.Router();

// Controller for handling voting
exports.vote = async (req, res) => {
  try {
    // Check if userId exists in the session
    console.log("Session:", req.session);
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not logged in" });
    }

    const { candidateId } = req.body;
    const userId = req.session.userId;
    console.log("User ID from session:", userId);
    console.log("Candidate ID from request:", candidateId);

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if user has already voted
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.hasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    // Update user's voting status
    user.hasVoted = true;
    await user.save();

    // Update candidate's vote count
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.votes += 1;
    await candidate.save();

    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
