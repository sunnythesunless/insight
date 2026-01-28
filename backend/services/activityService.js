const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

/**
 * Log an activity to the database for the Pulse Feed.
 * @param {string} workspaceId - The workspace ID.
 * @param {string} type - 'conflict' | 'decay' | 'version' | 'system'
 * @param {string} title - Short title.
 * @param {string} description - Detailed description.
 * @param {string} severity - 'info' | 'warning' | 'critical'
 * @param {object} metadata - Optional extra data.
 */
exports.logActivity = async (workspaceId, type, title, description, severity = 'info', metadata = {}) => {
    try {
        await ActivityLog.create({
            workspaceId,
            type,
            title,
            description,
            severity,
            metadata
        });

        // Also log to console for dev awareness
        logger.info(`[Activity] [${type.toUpperCase()}] ${title}`);
    } catch (error) {
        logger.error('Failed to create ActivityLog:', error);
    }
};

/**
 * Get recent activities for a workspace.
 * @param {string} workspaceId 
 * @param {number} limit 
 */
exports.getRecentActivity = async (workspaceId, limit = 20) => {
    return await ActivityLog.find({ workspaceId })
        .sort({ createdAt: -1 })
        .limit(limit);
};
