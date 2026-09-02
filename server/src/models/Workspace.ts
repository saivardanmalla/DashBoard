import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  organization: Types.ObjectId;
  owner: Types.ObjectId;
  members: { user: Types.ObjectId; role: string; joinedAt: Date }[];
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['WORKSPACE_ADMIN', 'MEMBER', 'VIEWER'],
          default: 'MEMBER',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Ensure workspace slug is unique per organization
WorkspaceSchema.index({ slug: 1, organization: 1 }, { unique: true });

export const Workspace = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
