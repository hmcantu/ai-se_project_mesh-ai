import { Schema, model, Document as MongooseDocument, Types } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  fileName: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const documentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DocumentModel = model<IDocument>('Document', documentSchema);