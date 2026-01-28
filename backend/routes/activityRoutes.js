const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getActivityFeed } = require('../controllers/activityController');

router.get('/feed', protect, getActivityFeed);

module.exports = router;
