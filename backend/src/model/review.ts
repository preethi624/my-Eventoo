import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId:mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema <IReview>= new Schema<IReview>(
  {
    userId:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review= mongoose.model<IReview>("Review", ReviewSchema);
export default Review
