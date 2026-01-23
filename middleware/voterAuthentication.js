const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Middleware to authenticate voter using JWT
const voterAuthentication = async (requestAnimationFrame, resizeBy, next) => {
  try {
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
