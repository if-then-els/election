const express = require("express");
const {
  voteCount,
  registeredVoters,
  deleteVoter,
  getRealTimeData,
  updateSettings,
  getSettings,
} = require("../controllers/adminController");
const { addCandidate, getResults } = require("../controllers/candidateController");
const { requireAdminSession } = require("../../middleware/adminAuth");
const Candidate = require("../models/candidates");
const router = express.Router();

router.get("/votes", requireAdminSession, voteCount);
router.get("/voters", requireAdminSession, registeredVoters);
router.delete("/voter", requireAdminSession, deleteVoter);
router.get("/realtime-data", requireAdminSession, getRealTimeData);
router.get("/results", requireAdminSession, getResults);

router.get("/settings", requireAdminSession, getSettings);
router.put("/settings", requireAdminSession, updateSettings);

router.post("/candidates", requireAdminSession, addCandidate);
router.get("/candidates", requireAdminSession, async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, name: 1 });
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/candidate", requireAdminSession, async (req, res) => {
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

router.delete("/candidates-all", requireAdminSession, async (req, res) => {
  try {
    await Candidate.deleteMany({});
    res.status(200).json({ message: "All candidates deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/reset-votes", requireAdminSession, async (req, res) => {
  try {
    await Candidate.updateMany({}, { votes: 0 });
    await User.updateMany({}, { hasVoted: false });
    res.status(200).json({ message: "All votes reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/voters-all", requireAdminSession, async (req, res) => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } });
    res.status(200).json({ message: "All voters deleted (admins preserved)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
