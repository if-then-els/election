const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt");

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password not provided" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.redirect("/home.html");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const newUser = new User({ name, password, email });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
