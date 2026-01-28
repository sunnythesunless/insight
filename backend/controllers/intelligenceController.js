const Document = require('../models/Document');
const Knowledge = require('../models/Knowledge');
const pdf = require('pdf-extraction');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * INGEST DOCUMENT
 * Handles PDF upload, versioning, text extraction, chunking, and embedding.
 */
exports.ingestDoc = async (req, res) => {
  try {
    const { docName, daysValid, workspaceId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // 1. VERSIONING LOGIC
    const lastDoc = await Document.findOne({ docName, workspaceId, status: 'active' });
    let version = 1;

    if (lastDoc) {
      lastDoc.status = 'archived';
      await lastDoc.save();
      version = lastDoc.version + 1;
    }

    // 3. TEXT PROCESSING (OFFLOADED TO WORKER)
    // Non-blocking for Event Loop!
    const { fork } = require('child_process');
    const path = require('path');

    const parsePdfInWorker = (buffer) => {
      return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, '../workers/pdfWorker.js');
        const child = fork(workerPath);

        child.send({ type: 'START_PARSE', buffer });

        child.on('message', (message) => {
          if (message.type === 'SUCCESS') {
            resolve(message.text);
            child.kill();
          } else if (message.type === 'ERROR') {
            reject(new Error(message.error));
            child.kill();
          }
        });

        child.on('error', (err) => {
          reject(err);
          child.kill();
        });

        setTimeout(() => {
          child.kill();
          reject(new Error('timeout'));
        }, 60000);
      });
    };

    const text = await parsePdfInWorker(file.buffer);

    // --- NEW: AI CHANGE SUMMARY (The "Gap Analysis" Feature) ---
    let changeSummary = null;

    if (lastDoc && version > 1) {
      const oldChunks = await Knowledge.find({
        workspaceId,
        documentName: docName,
        "metadata.version": lastDoc.version
      }).sort({ "metadata.ingestedAt": 1 }).limit(10);

      const oldText = oldChunks.map(c => c.content).join('\n').substring(0, 10000);
      const newText = text.substring(0, 10000);

      if (oldText && newText) {
        const summaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
           You are an expert editor. 
           Compare the following two document versions and summarize the key changes in 2-3 sentences.
           Focus on policy changes, dates, or numbers.
           
           OLD VERSION (Snippet):
           ${oldText}
           
           NEW VERSION (Snippet):
           ${newText}
           
           OUTPUT:
         `;
        try {
          const summaryResult = await summaryModel.generateContent(prompt);
          changeSummary = summaryResult.response.text();
        } catch (err) {
          console.warn("Change Summary Generation Failed:", err.message);
        }
      }
    }

    // 2. CREATE THE MASTER RECORD
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (parseInt(daysValid) || 180));

    await Document.create({
      docName,
      workspaceId,
      uploadedBy: req.user._id,
      version,
      daysValid: parseInt(daysValid) || 180,
      status: 'active',
      expiresAt,
      changeSummary
    });

    // 4. EMBEDDING & STORAGE
    const chunks = [];
    const CHUNK_SIZE = 1000;
    const OVERLAP = 200;

    for (let i = 0; i < text.length; i += (CHUNK_SIZE - OVERLAP)) {
      chunks.push(text.substring(i, i + CHUNK_SIZE));
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    let processedCount = 0;
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;

      const result = await model.embedContent({
        content: { parts: [{ text: chunk }] },
      });

      await Knowledge.create({
        workspaceId,
        documentName: docName,
        content: chunk,
        embedding: result.embedding.values,
        metadata: {
          expiresAt,
          version,
          uploadedBy: req.user.name,
          ingestedAt: new Date()
        }
      });
      processedCount++;
    }

    // LOG ACTIVITY
    const activityService = require('../services/activityService');
    const logType = version > 1 ? 'version' : 'upload';
    const logTitle = version > 1 ? 'New Version Ingested' : 'Document Uploaded';
    const logDesc = version > 1
      ? `Uploaded "${docName}" v${version}. ${changeSummary ? 'Change summary generated.' : ''}`
      : `New document "${docName}" added to the vault.`;

    await activityService.logActivity(
      workspaceId,
      logType,
      logTitle,
      logDesc,
      'info',
      { docId: docName, version, changeSummary }
    );

    res.status(200).json({
      success: true,
      message: `Uploaded ${docName} v${version}`,
      changeSummary,
      details: {
        version,
        chunksProcessed: processedCount,
        expiresAt
      }
    });

  } catch (error) {
    console.error("Ingest Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * QUERY KNOWLEDGE
 * Handles Vector Search, Conflict Detection ("Liar Test"), and AI Response.
 */
exports.queryKnowledge = async (req, res) => {
  try {
    const { query, workspaceId } = req.body;

    // 1. Get query embedding
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await embedModel.embedContent({
      content: { parts: [{ text: query }] }
    });
    const embedding = result.embedding.values;

    // 2. Vector Search (Atlas)
    // We look for the top 5 most relevant chunks in this workspace
    // Filter out decayed documents
    const results = await Knowledge.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 5,
          filter: {
            workspaceId: workspaceId
          }
        }
      },
      // Filter expired docs manually if vector search filter is limited, 
      // but ideally this is in the match stage or filter above
      {
        $match: {
          $or: [
            { "metadata.expiresAt": { $gt: new Date() } },
            { "metadata.expiresAt": { $exists: false } }
          ]
        }
      },
      {
        $project: {
          content: 1,
          documentName: 1,
          score: { $meta: "vectorSearchScore" },
          date: "$metadata.ingestedAt",
          version: "$metadata.version"
        }
      }
    ]);

    if (results.length === 0) {
      return res.status(200).json({
        answer: "I couldn't find any relevant active documents in this workspace to answer your question.",
        citations: []
      });
    }

    // 3. CONFLICT & DECAY LOGIC
    // Check if we have chunks with different version numbers for the same docName
    const docVersions = {};
    results.forEach(r => {
      if (!docVersions[r.documentName]) docVersions[r.documentName] = new Set();
      docVersions[r.documentName].add(r.version);
    });

    let hasConflict = false;
    Object.values(docVersions).forEach(versions => {
      if (versions.size > 1) hasConflict = true;
    });

    const newestDate = results.reduce((max, r) => r.date > max ? r.date : max, new Date(0));

    // 4. THE "INTELLIGENCE LAYER" PROMPT
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast & Smart

    const context = results.map(r =>
      `[Source: ${r.documentName} (v${r.version}), Date: ${r.date?.toISOString().split('T')[0]}] ${r.content}`
    ).join("\n\n");

    const systemPrompt = `
      You are the InsightOps Intelligence Layer. 
      Your mission: Provide a "Single Source of Truth."
      
      INSTRUCTIONS:
      1. Analyze the context provided below.
      2. DETECT CONFLICTS: Do different documents (or versions) provide different numbers, rules, or dates?
      3. RESOLUTION: If a conflict exists, prioritize the NEWEST version/date but clearly warn the user about the discrepancy.
      4. If no conflict exists, provide a concise, professional answer.
      5. Do not hallucinate. If the answer is not in the context, say so.
      
      CONTEXT:
      ${context}
    `;

    const chatResult = await chatModel.generateContent(`${systemPrompt}\n\nUSER QUESTION: ${query}`);
    const answer = chatResult.response.text();

    // 5. INTEGRITY REPORT

    // LOG ACTIVITY if conflict found
    if (hasConflict) {
      const activityService = require('../services/activityService');
      await activityService.logActivity(
        workspaceId,
        'conflict',
        'Contradiction Detected',
        `Query regarding "${query}" revealed conflicts between multiple document versions.`,
        'warning',
        { query, conflictDocs: Object.keys(docVersions) }
      );
    }

    res.status(200).json({
      answer: answer,
      integrityReport: {
        sourcesChecked: results.length,
        potentialConflict: hasConflict,
        newestDataDate: newestDate,
        warning: hasConflict ? "Warning: Multiple versions of the same document were found. Verification recommended." : null
      },
      citations: results.map(r => ({
        doc: r.documentName,
        version: r.version,
        confidence: (r.score * 100).toFixed(2) + "%",
        uploaded: r.date
      }))
    });

  } catch (error) {
    console.error("Query Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET DOCUMENTS
 * Fetch all documents for a workspace (Vault View).
 */
exports.getDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ success: false, message: "Workspace ID required" });

    const docs = await Document.find({ workspaceId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents: docs
    });
  } catch (error) {
    console.error("Get Docs Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

/**
 * GET WORKSPACE DOCUMENTS
 * Fetches all documents for a given workspace sorted by date.
 */
exports.getWorkspaceDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

    const docs = await Document.find({ workspaceId }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('Fetch Docs Error:', err);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};