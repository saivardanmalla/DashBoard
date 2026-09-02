import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProjectHealthHistory extends Document {
  projectId: Types.ObjectId;
  score: number;
  taskScore: number;
  deadlineScore: number;
  workloadScore: number;
  riskScore: number;
  activityScore: number;
}

const ProjectHealthHistorySchema = new Schema<IProjectHealthHistory>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    score: { type: Number, required: true },
    taskScore: { type: Number, required: true },
    deadlineScore: { type: Number, required: true },
    workloadScore: { type: Number, required: true },
    riskScore: { type: Number, required: true },
    activityScore: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ProjectHealthHistory = mongoose.model<IProjectHealthHistory>('ProjectHealthHistory', ProjectHealthHistorySchema);
