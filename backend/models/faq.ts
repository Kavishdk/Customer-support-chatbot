import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFAQ extends Document {
  content: string;
  category: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
