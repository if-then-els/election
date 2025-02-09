const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await findOne({ name, password });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const newUser = new User({ name, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
