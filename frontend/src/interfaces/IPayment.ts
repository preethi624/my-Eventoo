import type { IOrder } from "./IOrder";

export interface OrderCreateInput{
    totalPrice:number;
    ticketCount:number;
    userId:string;
    eventId:string;
    eventTitle:string
}
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
export interface GetOrders{
    success:boolean;
    message:string;
    order?:IOrder[]
}
export interface UserProfile{
  totalSpent?:number;

  eventsBooked?:number;
  success?:boolean;
}
export interface OrderDetails{
  razorpayOrderId:string;
  createdAt:string;
  eventTitle:string;
  ticketCount:number;
  status:string;
  _id:string;
  bookingStatus:string;



}
export interface FetchOrders{
    result?:IOrder[],
    totalPages?:number,
    currentPage?:number,
    success?:boolean,
    message?:string
}
export interface OrgOrder{
  order?:IOrder;
  success:boolean;
  message:string;
}
