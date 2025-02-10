const { login, register } = require("../controllers/clientAuth");
const { vote } = require("../controllers/votingController");
const { addCandidate } = require("../controllers/candidateController");
const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.post("/login", login);
router.post("/register", register);
router.post("/vote", vote);
router.post("/add-candidate", addCandidate); // New route for adding candidates

// Route to fetch user information
router.get("/user-info", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).json({ message: "User not logged in" });
    }
    const user = await User.findById(userId);
    res.status(200).json({ name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
