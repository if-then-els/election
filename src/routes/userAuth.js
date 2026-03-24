const { login, register, registerAdmin } = require("../controllers/clientAuth");
const { getCandidatesByPosition, getResults } = require("../controllers/candidateController");
const { requireAdminSession } = require("../../middleware/adminAuth");
const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.post("/login", login);
router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.get("/candidates", getCandidatesByPosition);
router.get("/results", requireAdminSession, getResults);

router.get("/user-info", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).json({ message: "User not logged in" });
    }
    const user = await User.findById(userId);
    res.status(200).json({ name: user.name, phoneNumber: user.phoneNumber, userId: userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
