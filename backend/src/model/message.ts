import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  chatRoomId?: string;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  chatRoomId: { type: String },
});

export const MessageModel = model<IMessage>("Message", messageSchema);
