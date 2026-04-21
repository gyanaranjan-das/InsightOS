import mongoose, { Schema, Document, Types } from 'mongoose';

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  orgId: Types.ObjectId;
  refreshToken: string | null;
  mfaEnabled: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'], default: 'MEMBER' },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    refreshToken: { type: String, default: null },
    mfaEnabled: { type: Boolean, default: false },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.index({ orgId: 1 });
userSchema.index({ email: 1, orgId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
