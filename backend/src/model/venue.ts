import mongoose, { Document, Schema } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  address:string;
  city:string;
  state:string;
  pincode:string;
  description: string;
  capacity: number;
  contactPerson:string
  phone:number;
  email:string;
  images: string[];
  website:string;
  facilities:string[];
  status:string;


 

  
  
  
}

const venueSchema: Schema<IVenue> = new Schema<IVenue>({
  name:{type:String,required:true},
  address:{type:String,required:true},
  city:{type:String,required:true},
  state:{type:String,required:true},
  pincode:{type:String,required:true},
  description:{type:String,required:true},
  capacity:{type:Number,required:true},
  contactPerson:{type:String,required:true},
  phone:{type:Number,required:true},
  email:{type:String,required:true},
  images:{type:[String],default:[]},
  website:{type:String,required:true},
  facilities:{type:[String]},
  status:{type:String,enum:['active','inactive']}


},{timestamps:true});

const Venue = mongoose.model<IVenue>('Venue', venueSchema);

export default Venue;
