const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/jwtAuth');
const votingController = require('../controllers/votingController');

router.post('/cast-vote', authenticateToken, votingController.vote);
router.get('/voting-status', votingController.getVotingStatus);
router.get('/results', authenticateToken, votingController.getResults);
router.get('/candidates', votingController.getCandidates);

module.exports = router;