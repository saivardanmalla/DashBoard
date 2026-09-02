import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDocumentItem extends Document {
  project: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  summary?: string;
  chunks: { chunkIndex: number; content: string; embedding: number[] }[];
}

const DocumentSchema = new Schema<IDocumentItem>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    summary: String,
    chunks: [{ chunkIndex: Number, content: String, embedding: [Number] }],
  },
  { timestamps: true }
);

export const ProjectDocument = mongoose.model<IDocumentItem>('ProjectDocument', DocumentSchema);
