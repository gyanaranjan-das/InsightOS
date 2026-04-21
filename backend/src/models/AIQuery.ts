import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAIQuery extends Document {
  orgId: Types.ObjectId;
  userId: Types.ObjectId;
  question: string;
  result: {
    insight: string;
    recommendations: string[];
    confidence: number;
    dataPoints: { label: string; value: number }[];
  };
  createdAt: Date;
}

const aiQuerySchema = new Schema<IAIQuery>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    result: {
      insight: { type: String, default: '' },
      recommendations: [{ type: String }],
      confidence: { type: Number, default: 0 },
      dataPoints: [{ label: String, value: Number }],
    },
  },
  { timestamps: true }
);

aiQuerySchema.index({ orgId: 1, createdAt: -1 });

export const AIQuery = mongoose.model<IAIQuery>('AIQuery', aiQuerySchema);
