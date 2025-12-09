import mongoose from 'mongoose';

/**
 * FAQ Schema for Retrieval Augmented Generation.
 * 
 * IMPORTANT: You must create an Atlas Vector Search Index on the 'embedding' field.
 * 
 * Index Definition JSON for Atlas:
 * {
 *   "mappings": {
 *     "dynamic": true,
 *     "fields": {
 *       "embedding": {
 *         "type": "knnVector",
 *         "dimensions": 768,
 *         "similarity": "cosine"
 *       }
 *     }
 *   }
 * }
 */
const FAQSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], // Vector embedding from Gemini text-embedding-004
    required: true,
  },
}, { timestamps: true });

// Prevent overwrite if compiled multiple times
export const FAQModel = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);