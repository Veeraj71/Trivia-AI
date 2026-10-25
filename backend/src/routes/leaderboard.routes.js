const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/global', leaderboardController.getGlobalLeaderboard);
router.get('/contest/:id', leaderboardController.getContestLeaderboard);
router.get('/:id', leaderboardController.getContestLeaderboard);

module.exports = router;