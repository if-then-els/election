const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/jwtAuth');
const votingController = require('../controllers/votingController');

// Protected routes - require JWT authentication
router.post('/cast-vote', authenticateToken, votingController.castVote);
router.get('/voting-status', authenticateToken, votingController.getVotingStatus);
router.get('/results', authenticateToken, votingController.getResults);

// Public routes - no authentication required
router.get('/candidates', votingController.getCandidates);

module.exports = router;