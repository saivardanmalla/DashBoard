import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  owner: Types.ObjectId;
  members: { user: Types.ObjectId; role: string; joinedAt: Date }[];
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['ORG_ADMIN', 'MEMBER', 'VIEWER'],
          default: 'MEMBER',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
