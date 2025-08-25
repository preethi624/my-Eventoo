export interface IReviewWithExtras {
  _id: string;
  userId:string ;        // populated user object
  eventId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "UNKNOWN"; 
}