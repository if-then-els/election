const express = require("express");
const {
  voteCount,
  registeredVoters,
  deleteVoter,
  getRealTimeData,
} = require("../controllers/adminController");
const { addCandidate, getResults } = require("../controllers/candidateController");
const { requireAdminSession } = require("../../middleware/adminAuth");
const Candidate = require("../models/candidates");
const router = express.Router();

router.get("/votes", requireAdminSession, voteCount);
router.get("/voters", requireAdminSession, registeredVoters);
router.delete("/voter", requireAdminSession, deleteVoter);
router.get("/realtime-data", requireAdminSession, getRealTimeData);
router.get("/results", requireAdminSession, getResults); // Admin results endpoint

// Candidate management routes
router.post("/candidates", addCandidate);
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, name: 1 });
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/candidate", async (req, res) => {
  try {
    const { id } = req.body;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
