import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  title: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Chat = model<IChat>('Chat', chatSchema);