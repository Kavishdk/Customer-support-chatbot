import { Request, Response } from 'express';
import { createEmbedding, generateRAGResponse, ChatHistoryMessage } from '../services/gemini';
import { searchSimilarFAQs, seedKnowledgeBase } from '../services/knowledgeService';

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, history } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query string is required' });
      return;
    }

    const queryVector = await createEmbedding(query);
    const searchResults = await searchSimilarFAQs(queryVector, 3);
    const contextDocuments = searchResults.map((r) => r.content);

    const safeHistory: ChatHistoryMessage[] = Array.isArray(history)
      ? history.slice(-10).filter((m) => m && typeof m.content === 'string')
      : [];

    const answer = await generateRAGResponse(query, contextDocuments, safeHistory);

    res.json({
      answer,
      context: contextDocuments,
    });
  } catch (error) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: 'Failed to process chat request', details: message });
  }
};

export const handleIngest = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting knowledge base ingestion...');
    const count = await seedKnowledgeBase();
    console.log(`Ingested ${count} documents successfully.`);
    res.json({ message: 'Ingestion complete', count });
  } catch (error) {
    console.error('Ingestion error:', error);
    res.status(500).json({ error: 'Failed to ingest documents' });
  }
};
