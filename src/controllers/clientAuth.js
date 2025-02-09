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

    // Since passwords are in plain text, a direct comparison works:
    const isMatch = password === user.password;
    console.log(password, " and ", user.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.redirect("/home.html");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Hash the password before saving
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, password, email });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
