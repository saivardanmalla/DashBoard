import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  user: Types.ObjectId;
  project?: Types.ObjectId;
  action: string;
  resourceType: 'PROJECT' | 'TASK' | 'DOCUMENT' | 'MEMBER' | 'CHAT' | 'AI' | 'SYSTEM';
  resourceId?: Types.ObjectId;
  resourceTitle?: string;
  metadata?: Record<string, any>;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    action: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ['PROJECT', 'TASK', 'DOCUMENT', 'MEMBER', 'CHAT', 'AI', 'SYSTEM'],
      required: true,
    },
    resourceId: { type: Schema.Types.ObjectId },
    resourceTitle: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

ActivitySchema.index({ project: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
