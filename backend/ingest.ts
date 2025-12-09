import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FAQModel } from './models';
import { generateEmbedding } from './services';
import { RAW_FAQS } from './data/faqs';

dotenv.config();

/**
 * Script: Ingest FAQs to MongoDB
 * Usage: npm run ingest
 */
const runIngestion = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI not defined in .env file");

        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("✅ Connected.");

        console.log("🧹 Clearing existing knowledge base...");
        await FAQModel.deleteMany({});

        console.log(`📝 Ingesting ${RAW_FAQS.length} documents...`);

        // Generate Embeddings & Save to DB
        // Using Promise.all would be faster but serial loop avoids rate limits easier
        let count = 0;
        for (const doc of RAW_FAQS) {
            // Small delay to respect rate limits
            await new Promise(r => setTimeout(r, 200));

            const embedding = await generateEmbedding(doc.content);
            await FAQModel.create({
                content: doc.content,
                category: doc.category,
                embedding: embedding
            });
            count++;
            process.stdout.write(`\r✅ Processed ${count}/${RAW_FAQS.length}`);
        }

        console.log("\n✨ Ingestion complete. Database is updated.");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Ingestion Error:", error);
        process.exit(1);
    }
};

runIngestion();
