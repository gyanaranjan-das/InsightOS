import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEmbedding extends Document {
  orgId: Types.ObjectId;
  content: string;
  vector: number[];
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const embeddingSchema = new Schema<IEmbedding>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    content: { type: String, required: true },
    vector: [{ type: Number }],
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

embeddingSchema.index({ orgId: 1 });

export const Embedding = mongoose.model<IEmbedding>('Embedding', embeddingSchema);
