import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document{
    eventId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    quantity:number;
    totalAmount:number;
    bookingDate:Date;


}
const bookingSchema:Schema<IBooking>=new Schema<IBooking>({
    eventId:{type:mongoose.Schema.Types.ObjectId,ref:'EventModel'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    quantity:Number,
    totalAmount:Number,
    bookingDate:{type:Date,default:Date.now}


})
const Booking=mongoose.model<IBooking>('Booking',bookingSchema);
export default Booking;