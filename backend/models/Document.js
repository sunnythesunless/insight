const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docName: { type: String, required: true },
  workspaceId: { type: String, required: true, index: true }, // Scopes all queries
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  version: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['active', 'archived', 'processing', 'decayed'],
    default: 'active'
  },
  daysValid: { type: Number, default: 30 },
  expiresAt: { type: Date },
  // Metadata for the "Intelligence" layer
  hash: { type: String }, // To detect if the exact same file is re-uploaded
  changeSummary: { type: String }, // AI-generated summary of changes from previous version
}, { timestamps: true });

// Index for fast "Liar Test" lookups (finding older versions of the same doc)
documentSchema.index({ docName: 1, workspaceId: 1, version: -1 });

module.exports = mongoose.model('Document', documentSchema);