const pdf = require('pdf-extraction');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Knowledge = require('../models/Knowledge'); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.processAndEmbedPDF = async (fileBuffer, workspaceId, docName, version, expiresAt) => {
  try {
    // 1. Validate Buffer
    if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error("Empty or invalid file buffer received.");
    }

    // 2. Parse PDF
    // Passing the buffer directly. pdf-extraction expects a Buffer.
    const data = await pdf(fileBuffer);
    
    if (!data || !data.text) {
        throw new Error("Could not extract text from PDF. File might be corrupted or empty.");
    }

    // 3. Chunking
    const chunks = [];
    const text = data.text.replace(/\n/g, ' '); // Clean up newlines for better embeddings
    for (let i = 0; i < text.length; i += 800) {
      chunks.push(text.substring(i, i + 1000));
    }

    // 4. Select Model
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // 5. Loop through chunks and embed
    for (const chunk of chunks) {
      const result = await model.embedContent({
        content: { parts: [{ text: chunk }] }
      });

      const embedding = result.embedding.values;

      await Knowledge.create({
        workspaceId,
        documentName: docName,
        content: chunk,
        embedding: embedding,
        metadata: { 
          expiresAt, 
          version, 
          ingestedAt: new Date() 
        }
      });
    }
    return chunks.length;
  } catch (error) {
    console.error("❌ AI Service Error:", error.message);
    throw error;
  }
};