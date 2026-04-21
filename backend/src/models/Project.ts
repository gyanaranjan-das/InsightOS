import mongoose, { Schema, Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProject extends Document {
  name: string;
  orgId: Types.ObjectId;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    apiKey: { type: String, required: true, unique: true, default: () => `ik_${uuidv4().replace(/-/g, '')}` },
  },
  { timestamps: true }
);

projectSchema.index({ orgId: 1 });


export const Project = mongoose.model<IProject>('Project', projectSchema);
