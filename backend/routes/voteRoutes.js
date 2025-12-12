const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const verifyToken = require('../middleware/auth');

router.get('/', voteController.getResults);
router.post('/', verifyToken, voteController.castVote);

module.exports = router;
