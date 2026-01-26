const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-extraction'); // Using the more stable library
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Knowledge = require('../models/Knowledge');

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const { workspaceId, docName } = req.body;

    // 1. PDF EXTRACTION
    // This library is a direct function, no "object" or "class" issues.
    const data = await pdf(req.file.buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error("PDF parsed but no text found (Check for scanned images).");
    }

    // 2. CHUNKING (InsightOps standard)
    const chunks = [];
    for (let i = 0; i < text.length; i += 800) {
      chunks.push(text.substring(i, i + 1000));
    }

    // 3. AI EMBEDDINGS & DB SAVE
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    for (const chunk of chunks) {
      const result = await model.embedContent(chunk);
      await Knowledge.create({
        workspaceId,
        documentName: docName || req.file.originalname,
        content: chunk,
        embedding: result.embedding.values
      });
    }
    
    res.status(200).json({ success: true, chunksProcessed: chunks.length });
  } catch (error) {
    console.error("🔥 SYSTEM ERROR:", error.message);
    res.status(500).json({ error: "Ingestion failed", details: error.message });
  }
});

module.exports = router;