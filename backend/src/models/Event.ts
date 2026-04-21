import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  projectId: Types.ObjectId;
  name: string;
  properties: Record<string, unknown>;
  userId: string | null;
  sessionId: string | null;
  timestamp: Date;
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    properties: { type: Schema.Types.Mixed, default: {} },
    userId: { type: String, default: null },
    sessionId: { type: String, default: null },
    timestamp: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

eventSchema.index({ projectId: 1, timestamp: -1 });
eventSchema.index({ projectId: 1, name: 1 });
eventSchema.index({ projectId: 1, userId: 1 });
eventSchema.index({ projectId: 1, sessionId: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
