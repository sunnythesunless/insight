const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createWorkspace, getMyWorkspaces, joinWorkspace } = require('../controllers/workspaceController');

router.post('/', protect, createWorkspace);
router.get('/', protect, getMyWorkspaces);
router.post('/join', protect, joinWorkspace);

module.exports = router;
