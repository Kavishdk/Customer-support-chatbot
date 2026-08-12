import { FAQ } from '../models/faq';
import { createEmbedding } from './gemini';
import { RAW_FAQS } from '../data/faqs';

export interface VectorSearchResult {
  content: string;
  score?: number;
}

export const searchSimilarFAQs = async (
  queryVector: number[],
  limit = 3
): Promise<VectorSearchResult[]> => {
  const results = await FAQ.aggregate<VectorSearchResult>([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector,
        numCandidates: 100,
        limit,
      },
    },
    {
      $project: {
        _id: 0,
        content: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]);

  return results;
};

export const seedKnowledgeBase = async (): Promise<number> => {
  await FAQ.deleteMany({});

  for (const doc of RAW_FAQS) {
    // Respect Gemini rate limits with a small gap
    await new Promise((resolve) => setTimeout(resolve, 200));

    const embedding = await createEmbedding(doc.content);

    await FAQ.create({
      content: doc.content,
      category: doc.category,
      embedding,
    });
  }

  return RAW_FAQS.length;
};
