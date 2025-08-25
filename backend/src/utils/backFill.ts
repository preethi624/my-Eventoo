
import EventModel from "../model/event";
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ;

const connectDB = async (): Promise<void> => {
  try {
    if(!MONGO_URI){
      throw new Error("no uri present")
    }
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    
  }
};

async function backfillLocation() {
   await connectDB()
const events=await EventModel.find({ location: { $exists: false }, latitude: { $exists: true ,$ne:null}, longitude: { $exists: true ,$ne:null} });


for(const event of events){
  console.log("event",event);
  
 
  
   await EventModel.updateOne({_id:event._id},
    {
      $set: {
        location: {
          type: "Point",
          coordinates: [event.longitude, event.latitude],
        },
      },
    }
   )
}

  

  console.log("Backfill completed!");
 
}

backfillLocation()
