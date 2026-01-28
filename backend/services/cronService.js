const cron = require('node-cron');
const Document = require('../models/Document');
const User = require('../models/User'); // Assuming User model has email
const emailService = require('./emailService');
const logger = require('../utils/logger');

/**
 * CRON SERVICE
 * Automates the "Knowledge Decay" detection and reporting.
 */

const initCronJobs = () => {
    logger.info("⏰ Cron Service Initialized: Knowledge Decay Detector is active.");

    // Run every day at midnight: '0 0 * * *'
    // For demo/testing purposes, we can run it every minute: '* * * * *' 
    // Let's stick to a daily schedule for production simulation
    cron.schedule('0 0 * * *', async () => {
        logger.info("Running Daily Knowledge Decay Scan...");

        try {
            const now = new Date();

            // 1. Find ACTIVE documents that have passed their expiration date
            const expiredDocs = await Document.find({
                status: 'active',
                expiresAt: { $lt: now }
            });

            if (expiredDocs.length === 0) {
                logger.info("No decayed documents found.");
                return;
            }

            logger.info(`Found ${expiredDocs.length} decayed documents. Processing...`);

            // Group by Workspace to send batch emails
            const docsByWorkspace = {};

            for (const doc of expiredDocs) {
                // Mark as decayed
                doc.status = 'decayed';
                await doc.save();

                if (!docsByWorkspace[doc.workspaceId]) {
                    docsByWorkspace[doc.workspaceId] = [];
                }
                docsByWorkspace[doc.workspaceId].push(doc);
            }

            // 2. Notify Admins & LOG ACTIVITY
            const activityService = require('./activityService');

            for (const [workspaceId, docs] of Object.entries(docsByWorkspace)) {
                // Log to Pulse Feed
                await activityService.logActivity(
                    workspaceId,
                    'decay',
                    'Knowledge Decay Alert',
                    `${docs.length} document(s) have reached their validity limit and require review.`,
                    'warning',
                    { count: docs.length, docIds: docs.map(d => d._id) }
                );

                // Find admins for this workspace (Assuming we can query Users by workspace)
                // Since schema for user/workspace mapping might be in 'workspace_members' or 'User' model:
                // Adapting to generic User model for now (assuming 'role' or similar, or just sending to a system admin in the brief)

                // Simulating finding a contact email (In a real app, query WorkspaceMembers joined with Users)
                // For MVP, if we don't have easy workspace-user mapping, we log it or send to a global admin.
                // Let's assume we can notify the uploader of the first doc as a fallback
                const contactId = docs[0].uploadedBy;
                const contactUser = await User.findById(contactId);

                if (contactUser && contactUser.email) {
                    await emailService.sendDecayReport(contactUser.email, `Workspace ${workspaceId}`, docs);
                } else {
                    logger.warn(`Could not find contact email for workspace ${workspaceId}`);
                }
            }

        } catch (error) {
            logger.error("Error in Knowledge Decay Cron:", error);
        }
    });
};

module.exports = initCronJobs;
