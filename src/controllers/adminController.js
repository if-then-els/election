const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/users");
const Candidate = require("../models/candidates");
const Settings = require("../models/settings");

exports.voteCount = async (req, res) => {
  try {
    const votes = await Candidate.find();
    res.status(200).json({ votes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registeredVoters = async (req, res) => {
  try {
    const voters = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ voters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVoter = async (req, res) => {
  try {
    const { id } = req.body;
    const voter = await User.findByIdAndDelete(id);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }
    res.status(200).json({ message: "Voter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRealTimeData = async (req, res) => {
  try {
    const voters = await User.find();
    const votes = await Candidate.find();
    const settings = await Settings.getSettings();
    res.status(200).json({ voters, votes, settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { votingEnabled, votingStartDate, votingEndDate, registrationEnabled } = req.body;
    
    const settings = await Settings.getSettings();
    
    if (votingEnabled !== undefined) settings.votingEnabled = votingEnabled;
    if (votingStartDate !== undefined) settings.votingStartDate = votingStartDate ? new Date(votingStartDate) : null;
    if (votingEndDate !== undefined) settings.votingEndDate = votingEndDate ? new Date(votingEndDate) : null;
    if (registrationEnabled !== undefined) settings.registrationEnabled = registrationEnabled;
    
    await settings.save();
    
    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
