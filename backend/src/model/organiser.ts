import mongoose, { Document, Schema, Model, ObjectId } from "mongoose";

export interface IOrganiser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  otp?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  authMethod?: string;
  status: string;
  location?: string;
  phone?: number;
  aboutMe?: string;
  profileImage: string;
}

const organiserSchema: Schema<IOrganiser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.authMethod !== "google";
    },
  },
  role: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  isBlocked: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  location: { type: String },
  phone: { type: Number },
  aboutMe: { type: String },
  profileImage: { type: String },
});
const Organiser: Model<IOrganiser> = mongoose.model<IOrganiser>(
  "Organiser",
  organiserSchema
);
export default Organiser;
