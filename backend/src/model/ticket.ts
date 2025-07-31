// models/Ticket.ts
import mongoose, { Document } from 'mongoose';
export interface ITicket extends Document{
    userId:  mongoose.Schema.Types.ObjectId,
  orderId: mongoose.Schema.Types.ObjectId,
  eventId:  mongoose.Schema.Types.ObjectId, 
  qrToken: string,
  issuedAt:  Date, 
  checkedIn:  boolean, 


}

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrToken: { type: String, unique: true },
  issuedAt: { type: Date, default: Date.now },
  checkedIn: { type: Boolean, default: false }
});

export const TicketModel = mongoose.model('Ticket', ticketSchema);
