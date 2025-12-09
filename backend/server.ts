import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FAQModel } from './models';
import { generateEmbedding, generateRAGResponse } from './services';
import { RAW_FAQS } from './data/faqs';

// Initialize Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Setup ---
app.use(cors()); // Allow cross-origin requests from Frontend
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not defined in .env file");

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// --- API ROUTES ---

/**
 * Route: Ingest Knowledge Base
 * Purpose: Wipes the old database and seeds it with fresh FAQ data.
 * Process:
 * 1. Delete all existing documents.
 * 2. Loop through the raw FAQ data.
 * 3. Generate a vector embedding for each FAQ.
 * 4. Save the FAQ + Embedding to MongoDB.
 */
app.post('/api/ingest-docs', async (req, res) => {
  try {
    console.log("🔄 Starting knowledge base ingestion...");

    // 1. Clear existing knowledge base
    await FAQModel.deleteMany({});

    console.log(`📝 Ingesting ${RAW_FAQS.length} documents...`);

    // 2. Generate Embeddings & Save to DB
    for (const doc of RAW_FAQS) {
      // Add a small delay to respect API rate limits
      await new Promise(r => setTimeout(r, 200));

      const embedding = await generateEmbedding(doc.content);
      await FAQModel.create({
        content: doc.content,
        category: doc.category,
        embedding: embedding
      });
    }

    console.log("✅ Ingestion complete.");
    res.status(200).json({ message: "Ingestion complete", count: RAW_FAQS.length });
  } catch (error) {
    console.error("❌ Ingestion Error:", error);
    res.status(500).json({ error: "Failed to ingest documents" });
  }
});

/**
 * Route: Chat / RAG
 * Purpose: Answer user questions using the knowledge base.
 * Process:
 * 1. Receive user query.
 * 2. Convert query into a Vector Embedding.
 * 3. Search MongoDB for the most similar (semantic) documents.
 * 4. Pass the Query + Relevant Context to Gemini AI.
 * 5. Return the answer.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { query, history } = req.body;
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    // 1. Create a "Search Vector" from the user's question
    const queryVector = await generateEmbedding(query);

    // 2. Perform Vector Search in MongoDB
    // We ask MongoDB: "Find documents whose 'embedding' field is mathematically close to our queryVector"
    const results = await FAQModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100, // Look at 100 nearest neighbors
          limit: 3 // Return the Top 3 best matches
        }
      },
      {
        $project: {
          _id: 0,
          content: 1,
          score: { $meta: "vectorSearchScore" } // Include the similarity score for debugging
        }
      }
    ]);

    // 3. Extract just the text content from the search results
    const contextTexts = results.map((doc: any) => doc.content);

    // Validate/Filter History (Limit to last 10 messages to avoid token overflow)
    const validHistory = Array.isArray(history) ? history.slice(-10) : [];

    // 4. Ask Gemini to generate an answer based on this context
    const answer = await generateRAGResponse(query, contextTexts, validHistory);

    res.json({
      answer,
      context: contextTexts
    });

  } catch (error) {
    console.error("❌ Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat request", details: error instanceof Error ? error.message : String(error) });
  }
});

// --- Server Startup ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});