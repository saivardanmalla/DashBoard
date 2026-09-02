import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRisk extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number;
  impact: string;
  affectedTasks: Types.ObjectId[];
  recommendation: string;
  status: 'OPEN' | 'MITIGATED' | 'CLOSED';
}

const RiskSchema = new Schema<IRisk>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    probability: { type: Number, required: true, min: 0, max: 100 },
    impact: { type: String, required: true },
    affectedTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    recommendation: { type: String, default: '' },
    status: {
      type: String,
      enum: ['OPEN', 'MITIGATED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
  },
  { timestamps: true }
);

export const Risk = mongoose.model<IRisk>('Risk', RiskSchema);
