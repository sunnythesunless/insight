const express = require('express');
const router = express.Router();
const { protect, restrictTo, verifyWorkspace } = require('../middleware/authMiddleware');
const { ingestDoc, queryKnowledge } = require('../controllers/intelligenceController');

// Only Admins can Ingest
router.post('/ingest', protect, restrictTo('admin'), verifyWorkspace, ingestDoc);

// Everyone in the workspace can query
router.post('/query', protect, verifyWorkspace, queryKnowledge);

module.exports = router;