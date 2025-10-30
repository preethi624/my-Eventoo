import mongoose, { Document, Schema,Types } from "mongoose";
export interface IOfferImage {
  url: string;
  public_id: string | null;
}

export interface IOffer extends Document {
   _id: Types.ObjectId;
  title: string; // offer name, e.g. "Diwali Special"
  code: string; // code users enter, e.g. "DIWALI50"
  description?: string; // optional description
  discountType: "percentage" | "flat"; // 2 types of offers
  discountValue: number; // e.g. 20 for 20% or 100 for ₹100 flat
  minOrderAmount?: number; // optional, only apply if order >= X
  maxDiscountAmount?: number; // optional, limit discount amount
  startDate: Date;
  endDate: Date;
  usageLimit?: number; // how many times offer can be used overall
  usedCount: number; // track how many times used
  isActive: boolean; // admin can activate/deactivate
  createdBy: mongoose.Types.ObjectId; // admin reference
  createdAt: Date;
  updatedAt: Date;
    images: (string | IOfferImage)[];
}

const offerSchema = new Schema<IOffer>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
       images: {
             type: [Schema.Types.Mixed],
             default: [],
           },
  },
  { timestamps: true }
);

const Offer = mongoose.model<IOffer>("Offer", offerSchema);
export default Offer;
