import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Service: Embedding Generation
 * Use: Converts text into a mathematical vector (array of numbers).
 * Model: text-embedding-004 (optimized for semantic retrieval)
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  // Use the Gemini SDK to create embeddings
  const result = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ parts: [{ text }] }],
  });

  if (!result.embeddings || !result.embeddings[0] || !result.embeddings[0].values) {
    throw new Error("Failed to generate embedding");
  }

  return result.embeddings[0].values;
};

/**
 * Service: RAG Response Generation
 * Use: Sends the user query + retrieved facts to the LLM to get an answer.
 */
/**
 * Service: RAG Response Generation
 * Use: Sends the user query + retrieved facts + history to the LLM.
 */
export const generateRAGResponse = async (
  query: string,
  contextDocuments: string[],
  history: { role: string; content: string }[] = []
): Promise<string> => {
  // Join all retrieved documents into a single text block
  const contextBlock = contextDocuments.join("\n\n---\n\n");

  // Format history for the prompt
  const historyBlock = history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n");

  // Construct the "System Prompt"
  const prompt = `You are a friendly and helpful AI Support Assistant for Cimba.AI.
  
INSTRUCTIONS:
1. Answer the USER QUERY using primarily the information provided in the CONTEXT below.
2. ALso consider the CHAT HISTORY to understand follow-up questions (e.g., "how much is it?" referring to a previously discussed item).
3. If the answer is not in the context, politely state that you cannot find that information in the current documentation.
4. Keep the tone professional but warm.
5. Do not invent information (hallucinate).
6. Do NOT use markdown bolding (e.g., **text**) in your response. Keep text plain and clean.

CONTEXT (The following information is true):
${contextBlock}

CHAT HISTORY:
${historyBlock}

USER QUERY:
${query}`;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
};