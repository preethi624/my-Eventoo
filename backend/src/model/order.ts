
import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  amount: number; // original price before discount
  finalAmount: number; // after applying offer
  offerAmount: number; // discount given
  offerId?: mongoose.Types.ObjectId | null;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  razorpayPaymentId: string;
  eventTitle: string;
  ticketCount: number;
  createdAt: Date;
  orderId: string;
  bookingStatus: string;
  refundId: string;
  email: string;
  bookingNumber: string;
  selectedTicket: { type: string; capacity: number; price: number; sold?: number };
}

const orderSchema: Schema<IOrder> = new Schema<IOrder>({
  eventTitle: { type: String },
  orderId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  amount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  offerAmount: { type: Number, default: 0 },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", default: null },
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["created", "paid", "failed", "refunded", "Not required"],
    default: "created",
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  ticketCount: { type: Number },
  createdAt: { type: Date, default: Date.now },
  refundId: { type: String },
  email: { type: String },
  bookingNumber: { type: String, required: true, unique: true },
  selectedTicket: {
    type: {
      type: String,
      required: true,
    },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;

