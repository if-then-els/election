const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/users");
const Candidate = require("../models/candidates");

const router = express.Router();

// Controller for handling voting
exports.vote = async (req, res) => {
  try {
    // Check for user authentication (session or JWT)
    let userId;

    // First check session
    if (req.session && req.session.userId) {
      userId = req.session.userId;
    }
    // Then check JWT from Authorization header
    else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const jwt = require("jsonwebtoken");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError.message);
      }
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not logged in" });
    }

    console.log("User ID:", userId);

    // Extract all selected candidates from the dynamic form
    const selectedCandidates = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "userId") {
        // Exclude userId from candidates
        selectedCandidates[key] = req.body[key];
      }
    });

    console.log("User ID from session:", userId);
    console.log("Selected candidates:", selectedCandidates);

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
      return res.status(400).json({
        message: "You cannot Vote twice! Your vote has already been recorded.",
      });
    }

    // Update vote counts for all selected candidates
    for (const [position, candidateId] of Object.entries(selectedCandidates)) {
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res
          .status(404)
          .json({ message: `Candidate not found for position: ${position}` });
      }
      candidate.votes += 1;
      await candidate.save();
    }

    // Update user's voting status
    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
