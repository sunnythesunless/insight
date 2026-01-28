const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');
const Knowledge = require("../models/Knowledge");

// Ensure your Key is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function ingestPDF(fileBuffer, workspaceId, docName) {
  // 1. SAFE EXTRACTION: This fixes the "pdf is not a function" error
  const parse = (typeof pdf === 'function') ? pdf : (pdf.default || pdf);
  const data = await parse(fileBuffer);
  const fullText = data.text;

  if (!fullText || fullText.trim().length === 0) {
    throw new Error("PDF has no extractable text (likely a scanned image).");
  }

  // 2. CHUNKING: 1000-char chunks with 200-char overlap
  const chunks = [];
  const chunkSize = 1000;
  const overlap = 200;
  
  for (let i = 0; i < fullText.length; i += (chunkSize - overlap)) {
    chunks.push(fullText.substring(i, i + chunkSize));
  }

  // 3. AI EMBEDDINGS & MONGODB SAVE
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  for (const chunk of chunks) {
    const result = await model.embedContent(chunk);
    
    await Knowledge.create({
      workspaceId,
      documentName: docName,
      content: chunk,
      embedding: result.embedding.values,
      metadata: {
        sourceType: 'pdf',
        ingestedAt: new Date()
      }
    });
  }
  
  return { success: true, totalChunks: chunks.length };
}

module.exports = { ingestPDF };