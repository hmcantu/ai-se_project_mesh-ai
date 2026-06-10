import { Schema, model, Document, Types } from 'mongoose';

export interface IChunk extends Document {
  documentId: Types.ObjectId;
  text: string;
  embedding: number[];
  createdAt: Date;
}

const chunkSchema = new Schema<IChunk>({
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Chunk = model<IChunk>('Chunk', chunkSchema);