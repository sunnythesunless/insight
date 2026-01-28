const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member', 'read_only'], default: 'member' },
        joinedAt: { type: Date, default: Date.now }
    }],
    inviteCode: {
        type: String, // Simple mechanism for joining
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    limits: {
        maxDocuments: { type: Number, default: 100 },
        maxVectors: { type: Number, default: 10000 }
    },
    usage: {
        documentCount: { type: Number, default: 0 },
        vectorCount: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Generate a random invite code before saving
workspaceSchema.pre('save', function (next) {
    if (!this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Workspace', workspaceSchema);
