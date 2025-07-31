import mongoose ,{Document,Schema}from "mongoose";
export interface IOrder extends Document{
  _id:string;

    userId:mongoose.Types.ObjectId;
    eventId:mongoose.Types.ObjectId;
    amount:number;
    currency:string;
    status:string;
    razorpayOrderId:string;
    razorpaySignature:string;
    razorpayPaymentId:string;
    eventTitle:string;
    ticketCount:number;
    createdAt:Date;
    orderId:string;
    bookingStatus:string;
   
    refundId:string;
    email:string
   
   
}
const orderSchema:Schema<IOrder>=new Schema<IOrder>({
  eventTitle:{
    type:String,

  },
  orderId:{
    type:String
  },
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId:  
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    }
  ,
  amount: {
    type: Number,
    required: function () {
      return this.status !== "Not required";
    },
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed','refunded','Not required'],
    default: 'created',
  },
  bookingStatus:{
    type:String,
    enum:["confirmed","cancelled","pending"],
    default:"pending"
  },
  razorpayOrderId: {
    type: String,
    required:  function () {
    return this.amount > 0; 
  },
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  }, 
  ticketCount:{
    type:Number
  },
  createdAt:{
    type:Date
  },
 
  refundId: {type:String},
  email:{type:String}
 

})
const Order=mongoose.model<IOrder>('Order',orderSchema);
export default Order
