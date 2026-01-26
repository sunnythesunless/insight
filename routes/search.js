const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Knowledge = require('../models/Knowledge');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/query', async (req, res) => {
  try {
    const { query, workspaceId } = req.body;

    // 1. Generate Embedding (text-embedding-004 is still standard)
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const queryEmbedding = await embeddingModel.embedContent(query);

    // 2. Retrieve Relevant Chunks
    const results = await Knowledge.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", 
          path: "embedding",
          queryVector: queryEmbedding.embedding.values,
          numCandidates: 100,
          limit: 3
        }
      },
      { $match: { workspaceId: workspaceId } },
      { $project: { content: 1, documentName: 1, score: { $meta: "vectorSearchScore" } } }
    ]);

    if (results.length === 0) return res.status(404).json({ message: "No relevant knowledge found." });

    // 3. GENERATE ANSWER (The 2026 Success Fix)
    // gemini-2.5-flash is the stable workhorse for 2026.
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const contextText = results.map(r => `[Source: ${r.documentName}] ${r.content}`).join("\n\n");
    
    const prompt = `
      Instructions: Use the provided context to answer the question.
      Cite the source document names.

      CONTEXT:
      ${contextText}

      QUESTION:
      ${query}
    `;

    const chatResult = await chatModel.generateContent(prompt);
    
    // 4. Return Final Response with Citations
    res.status(200).json({
      answer: chatResult.response.text(),
      citations: results.map(r => ({
        doc: r.documentName,
        confidence: (r.score * 100).toFixed(2) + "%"
      }))
    });

  } catch (error) {
    console.error("🔍 InsightOps Search Error:", error.message);
    res.status(500).json({ error: "Search Failed", details: error.message });
  }
});

module.exports = router;