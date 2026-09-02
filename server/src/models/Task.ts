import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  project: Types.ObjectId;
  taskNumber: number;
  title: string;
  description: string;
  creator: Types.ObjectId;
  assignees: Types.ObjectId[];
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  order: number;
  subtasks: { title: string; isCompleted: boolean }[];
  tags: string[];
}

const TaskSchema = new Schema<ITask>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    taskNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
      default: 'TODO',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    order: { type: Number, default: 0 },
    subtasks: [{ title: String, isCompleted: { type: Boolean, default: false } }],
    tags: [String],
  },
  { timestamps: true }
);

TaskSchema.index({ project: 1, status: 1, order: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
