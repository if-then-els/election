const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const Settings = require("../models/settings");
const { generateToken } = require("../../middleware/jwtAuth");

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password not provided" });
    }
    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");
    const user = await User.findOne({ phoneNumber: normalizedPhone });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson || req.xhr) {
      const token = generateToken(user._id);
      return res.status(200).json({ 
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          phoneNumber: user.phoneNumber,
          hasVoted: user.hasVoted,
          role: user.role
        }
      });
    } else {
      req.session.userId = user._id;
      return res.redirect("/home.html");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Server error occurred" });
    }
  }
};

exports.register = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    if (!settings.registrationEnabled) {
      return res.status(403).json({ message: "Registration is currently closed" });
    }

    const { name, password, phoneNumber } = req.body;
    
    if (!name || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    if (normalizedPhone.length < 8) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const userExists = await User.findOne({ phoneNumber: normalizedPhone });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const newUser = new User({ name, password, phoneNumber: normalizedPhone });
    await newUser.save();

    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson || req.xhr) {
      const token = generateToken(newUser._id);
      return res.status(201).json({ 
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          hasVoted: newUser.hasVoted
        }
      });
    } else {
      req.session.userId = newUser._id;
      return res.redirect("/home.html");
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Server error occurred" });
    }
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, password, phoneNumber, secretKey } = req.body;
    
    if (!name || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (secretKey !== "ADMIN2024") {
      return res.status(403).json({ message: "Invalid admin secret key" });
    }

    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    const userExists = await User.findOne({ phoneNumber: normalizedPhone });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const newAdmin = new User({ 
      name, 
      password, 
      phoneNumber: normalizedPhone,
      role: 'admin' 
    });
    await newAdmin.save();

    return res.status(201).json({ 
      success: true,
      message: "Admin registered successfully",
      user: {
        id: newAdmin._id.toString(),
        name: newAdmin.name,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({ success: false, message: "Server error occurred" });
  }
};
