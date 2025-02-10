//fetch votes
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/users");
const Candidate = require("../models/candidates");

exports.voteCount = async (req, res) => {
  try {
    //fetch votes from database
    const votes = await Candidate.find();
    res.status(200).json({ votes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registeredVoters = async (req, res) => {
  try {
    //fetch votes from database
    const voters = await User.find();
    res.status(200).json({ voters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVoter = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const voter = await User.findByIdAndDelete(id);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }
    res.status(200).json({ message: "Voter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New method to fetch real-time data
exports.getRealTimeData = async (req, res) => {
  try {
    const voters = await User.find();
    const votes = await Candidate.find();
    res.status(200).json({ voters, votes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
