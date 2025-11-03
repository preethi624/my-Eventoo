import mongoose, { Document, Schema } from "mongoose";
export interface ISeatType {
  type: string;      
  seatCount: number; 
}

export interface IVenue extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  contactPerson: string;
  phone: number;
  email: string;
  images: string[];
  website: string;
  facilities: string[];
  status: string;
  seatTypes: ISeatType[];  
  totalCapacity: number;   
  totalCost: number;    

}
const seatTypeSchema = new Schema<ISeatType>({
  type: { type: String, required: true },
  seatCount: { type: Number, required: true },
});

const venueSchema: Schema<IVenue> = new Schema<IVenue>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    description: { type: String, required: true },
   
    contactPerson: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    images: { type: [String], default: [] },
    website: { type: String, required: true },
    facilities: { type: [String] },
    status: { type: String, enum: ["active", "inactive"] },
    seatTypes: { type: [seatTypeSchema], default: [] },
    totalCapacity: { type: Number, required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Venue = mongoose.model<IVenue>("Venue", venueSchema);

export default Venue;
