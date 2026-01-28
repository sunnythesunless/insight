const activityService = require('../services/activityService');

exports.getActivityFeed = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

        const activities = await activityService.getRecentActivity(workspaceId);
        res.json(activities);
    } catch (err) {
        console.error('Activity Feed Error:', err);
        res.status(500).json({ message: 'Failed to fetch activity feed' });
    }
};
