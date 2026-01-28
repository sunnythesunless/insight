const activityService = require('../services/activityService');

/**
 * GET ACTIVITY FEED
 * Returns the timeline of events for the Pulse Feed.
 */
exports.getActivityFeed = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

        const logs = await activityService.getRecentActivity(workspaceId, 50);

        // Transform for UI if needed (mapping fields)
        // ActivityLog schema matches UI expectations mostly: type, title, description, createdAt
        const feed = logs.map(log => ({
            id: log._id,
            type: log.type,
            title: log.title,
            description: log.description,
            timestamp: log.createdAt, // Frontend to format this
            severity: log.severity
        }));

        res.status(200).json({ success: true, feed });
    } catch (error) {
        console.error('Feed Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch activity feed' });
    }
};
