const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/users");
const Candidate = require("../models/candidates");
const Settings = require("../models/settings");

const router = express.Router();

const isVotingOpen = async () => {
  const settings = await Settings.getSettings();
  if (!settings.votingEnabled) return false;
  
  const now = new Date();
  if (settings.votingStartDate && now < settings.votingStartDate) return false;
  if (settings.votingEndDate && now > settings.votingEndDate) return false;
  
  return true;
};

exports.vote = async (req, res) => {
  try {
    if (!(await isVotingOpen())) {
      return res.status(403).json({ message: "Voting is currently closed" });
    }

    let userId;
    if (req.session && req.session.userId) {
      userId = req.session.userId;
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const jwt = require("jsonwebtoken");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (jwtError) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not logged in" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const selectedCandidates = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "userId") selectedCandidates[key] = req.body[key];
    });

    if (Object.keys(selectedCandidates).length === 0) {
      return res.status(400).json({ message: "No candidates selected" });
    }

    for (const [position, candidateId] of Object.entries(selectedCandidates)) {
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: `Candidate not found for position: ${position}` });
      }
      candidate.votes += 1;
      await candidate.save();
    }

    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote submitted successfully" });
  } catch (error) {
    console.error("Voting error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getVotingStatus = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const now = new Date();
    let status = "closed";
    
    if (settings.votingEnabled) {
      if (!settings.votingStartDate && !settings.votingEndDate) {
        status = "open";
      } else if (settings.votingStartDate && now < settings.votingStartDate) {
        status = "not_started";
      } else if (settings.votingEndDate && now > settings.votingEndDate) {
        status = "ended";
      } else {
        status = "open";
      }
    }

    res.status(200).json({
      status,
      votingEnabled: settings.votingEnabled,
      votingStartDate: settings.votingStartDate,
      votingEndDate: settings.votingEndDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    const groupedResults = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) acc[candidate.position] = [];
      acc[candidate.position].push(candidate);
      return acc;
    }, {});
    res.status(200).json(groupedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, name: 1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
