const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../middleware/jwtAuth");

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

    // Check if request wants JSON (API call) or HTML redirect (form submission)
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson || req.xhr) {
      // API call - return JWT token
      const token = generateToken(user._id);
      res.status(200).json({ 
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasVoted: user.hasVoted
        }
      });
    } else {
      // Form submission - use session and redirect
      req.session.userId = user._id;
      res.redirect("/home.html");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Check if user already exists by name
    const userExists = await User.findOne({ name, email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, password, email });
    await newUser.save();

    // Check if request wants JSON (API call) or HTML redirect (form submission)
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson || req.xhr) {
      // API call - return JWT token
      const token = generateToken(newUser._id);
      res.status(201).json({ 
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          hasVoted: newUser.hasVoted
        }
      });
    } else {
      // Form submission - use session and redirect
      req.session.userId = newUser._id;
      res.redirect("/home.html");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
