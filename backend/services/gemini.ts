import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error('API_KEY is not defined in environment variables');
}

const ai = new GoogleGenAI({ apiKey });

export interface ChatHistoryMessage {
  role: string;
  content: string;
}

export const createEmbedding = async (text: string): Promise<number[]> => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [{ parts: [{ text }] }],
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length === 0) {
    throw new Error('No embedding values returned from Gemini API');
  }

  return embedding;
};

export const generateRAGResponse = async (
  query: string,
  contextDocuments: string[],
  history: ChatHistoryMessage[] = []
): Promise<string> => {
  const contextBlock = contextDocuments.join('\n\n---\n\n');
  const historyBlock = history
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n');

  const prompt = `You are a helpful customer support assistant for Cimba.AI.

Instructions:
1. Answer the user query using the provided context whenever possible.
2. Consider the previous conversation history for context on follow-up questions.
3. If the answer is not available in the context, politely state that you do not have enough information in the current documentation.
4. Keep answers concise, clear, and professional.

Context:
${contextBlock}

Chat History:
${historyBlock}

User Query:
${query}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
};
