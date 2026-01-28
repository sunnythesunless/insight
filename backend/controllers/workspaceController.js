const Workspace = require('../models/Workspace');
const User = require('../models/User');

/**
 * CREATE WORKSPACE
 */
exports.createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Workspace name is required' });

        const workspace = await Workspace.create({
            name,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'admin' }]
        });

        res.status(201).json({ success: true, workspace });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * GET MY WORKSPACES
 */
exports.getMyWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            'members.user': req.user._id
        }).populate('owner', 'name email');

        res.status(200).json({ success: true, count: workspaces.length, workspaces });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * JOIN WORKSPACE (via Invoice Code or ID)
 */
exports.joinWorkspace = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const workspace = await Workspace.findOne({ inviteCode });
        if (!workspace) return res.status(404).json({ success: false, message: 'Invalid invite code' });

        // Check if member already exists
        const isMember = workspace.members.some(m => m.user.toString() === req.user._id.toString());
        if (isMember) return res.status(400).json({ success: false, message: 'Already a member' });

        workspace.members.push({ user: req.user._id, role: 'member' });
        await workspace.save();

        res.status(200).json({ success: true, message: `Joined ${workspace.name}`, workspace });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
