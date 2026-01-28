const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['conflict', 'decay', 'version', 'system', 'upload'],
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

// Index for fast timeline queries
activityLogSchema.index({ workspaceId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
