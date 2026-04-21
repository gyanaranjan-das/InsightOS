import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDashboard extends Document {
  name: string;
  projectId: Types.ObjectId;
  orgId: Types.ObjectId;
  layout: Record<string, unknown>;
  widgets: Record<string, unknown>[];
  createdAt: Date;
  updatedAt: Date;
}

const dashboardSchema = new Schema<IDashboard>(
  {
    name: { type: String, required: true, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    layout: { type: Schema.Types.Mixed, default: { columns: 2, rows: 3 } },
    widgets: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

dashboardSchema.index({ orgId: 1 });

export const Dashboard = mongoose.model<IDashboard>('Dashboard', dashboardSchema);
