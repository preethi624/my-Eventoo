// models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;       
  organizerId?: mongoose.Types.ObjectId; 
  message: string;                        
  type: "event_created" | "booking_confirmed" | "booking_cancelled" | "general"; 
  isRead: boolean;                       
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer", required: false },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["event_created", "booking_confirmed", "booking_cancelled", "general"], 
    required: true 
  },
  isRead: { type: Boolean, default: false },   
  createdAt: { type: Date, default: Date.now }
});

const Notification= mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification
