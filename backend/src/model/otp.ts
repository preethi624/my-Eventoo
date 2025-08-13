import mongoose, { Document, Schema, Model } from "mongoose";
interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

const OTP: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);
export default OTP;
