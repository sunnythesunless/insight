const express = require('express');
const router = express.Router();
const { protect, adminOnly, verifyWorkspace } = require('../middleware/auth');
const { ingestDoc, queryKnowledge, getWorkspaceDocuments } = require('../controllers/intelligenceController');
const multer = require('multer');

// Configure Multer for memory storage (processing Buffer in controller)
const upload = multer({ storage: multer.memoryStorage() });

// Ingest Route: Only Admins
router.post('/ingest', protect, adminOnly, verifyWorkspace, upload.single('file'), ingestDoc);

// Query Route: All Members
router.post('/query', protect, verifyWorkspace, queryKnowledge);

// GET Route: All Members
router.get('/documents', protect, getWorkspaceDocuments);

module.exports = router;