const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number], // 768-dimension vector
        required: true,
        index: '2dsphere' // Optional: for vector search if supported or basic array indexing
    },
    metadata: {
        sourceType: {
            type: String,
            default: 'pdf'
        },
        ingestedAt: {
            type: Date,
            default: Date.now
        },
        decayFactor: {
            type: Number,
            default: 1.0
        }
    },
    workflowLog: [
        {
            trigger: String,
            condition: String,
            action: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            details: mongoose.Schema.Types.Mixed
        }
    ]
});

// To this (forces the collection name to be 'knowledge'):
module.exports = mongoose.model('Knowledge', KnowledgeSchema, 'knowledge');
