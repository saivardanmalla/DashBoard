import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  key: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: Types.ObjectId;
  members: { user: Types.ObjectId; role: string; joinedAt: Date }[];
  tags: string[];
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    key: { type: String, required: true, uppercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, default: 'CONTRIBUTOR' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
