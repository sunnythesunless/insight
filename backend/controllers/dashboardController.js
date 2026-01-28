const Document = require('../models/Document');
const ActivityLog = require('../models/ActivityLog');

exports.getDashboardStats = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

        const totalDocs = await Document.countDocuments({ workspaceId });
        const activeDocs = await Document.countDocuments({ workspaceId, status: 'active' });

        // Count recent conflicts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const conflicts = await ActivityLog.countDocuments({
            workspaceId,
            type: 'conflict',
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            totalDocs,
            activeDocs,
            conflicts,
            integrity: conflicts > 0 ? 'Needs Review' : 'Healthy'
        });
    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
};
