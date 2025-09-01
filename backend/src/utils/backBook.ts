import mongoose from "mongoose";
import Order from "../model/order";
import dotenv from 'dotenv';
dotenv.config()



async function backfillBookingNumbers() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';
   await mongoose.connect(MONGO_URI);
   const orderIdsToDelete = ["ORD-20250829-2956", "ORD-20250829-6844"];


  await Order.deleteMany({orderId:{$in:orderIdsToDelete}})

  console.log("Deleted orders with orderIds:", orderIdsToDelete);
  process.exit(0);
}

backfillBookingNumbers();
