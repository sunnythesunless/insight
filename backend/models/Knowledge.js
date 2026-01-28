const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true },
  documentName: { type: String, required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], required: true }, 
  metadata: {
    sourceType: { type: String, default: 'pdf' },
    ingestedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true } // The "Kill Date"
  }
});

// Force singular 'knowledge' collection to avoid the 'knowledges' mess
module.exports = mongoose.model('Knowledge', KnowledgeSchema, 'knowledge');