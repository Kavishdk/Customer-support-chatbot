import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { seedKnowledgeBase } from './services/knowledgeService';

dotenv.config();

const run = async () => {
  try {
    await connectDatabase();
    console.log('Seeding knowledge base...');
    const count = await seedKnowledgeBase();
    console.log(`Ingestion complete. Seeded ${count} documents.`);
    process.exit(0);
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
};

run();
