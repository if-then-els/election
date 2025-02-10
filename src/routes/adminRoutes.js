const express = require("express");
const {
  voteCount,
  registeredVoters,
  deleteVoter,
  getRealTimeData,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/votes", voteCount);
router.get("/voters", registeredVoters);
router.delete("/voter", deleteVoter);
router.get("/realtime-data", getRealTimeData);

module.exports = router;
