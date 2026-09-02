import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProjectMemory extends Document {
  project: Types.ObjectId;
  category: 'DECISION' | 'ARCHITECTURE' | 'REQUIREMENT' | 'MEETING_SUMMARY' | 'RISK';
  title: string;
  content: string;
  tags: string[];
}

const ProjectMemorySchema = new Schema<IProjectMemory>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    category: {
      type: String,
      enum: ['DECISION', 'ARCHITECTURE', 'REQUIREMENT', 'MEETING_SUMMARY', 'RISK'],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true }
);

export const ProjectMemory = mongoose.model<IProjectMemory>('ProjectMemory', ProjectMemorySchema);
