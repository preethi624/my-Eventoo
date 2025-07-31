import { Document, ObjectId, Types } from "mongoose";
import { IEvent } from "src/model/event";
import { IOrder } from "src/model/order";
import { ITicket } from "src/model/ticket";



export interface OrderCreate{
    message:string;
    success:boolean;
    order?:IOrder;
}
export interface OrderCreateInput{
    totalPrice:number;
    ticketCount:number;
    userId:string;
    eventId:string;
    eventTitle:string;
    email?:string;

}
export interface IPaymentDTO{
     razorpayOrderId:string;
            amount:number;

            currency:string;
            receipt:string;
            status:string;
            ticketCount:number
            userId:string;
            eventId:string;
            eventTitle:string;
            createdAt:Date;
            orderId:string;
            email?:string
          

}
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
export interface VerifyResponse{
    success:boolean;
    message:string;
}
export interface GetOrders{
    success:boolean;
    message:string;
    order?:OrdersGet;
}
export interface OrdersGet{
    orders:IOrder[];
    totalPages:number;
    currentPage:number;
}
export interface AggregatedOrder extends Omit<IOrder, 'eventId'> {
  eventId: string;
  eventDetails: IEvent;
}
export interface GetOrder{
    success:boolean;
    message:string;
    order?:IOrder;
}
export interface UserProfileUpdate{
    success?:boolean;
    totalSpent?:number;
    eventsBooked?:number;
    message?:string

}
export interface FetchOrders{
    result?:IOrder[],
    totalPages?:number,
    currentPage?:number,
    success?:boolean,
    message?:string
}
export interface Update{
    success:boolean,
    refundId?:string,
    message?:string
}
export interface GetTickets{
    result?:ITicket[];
    success?:boolean;
}
export interface TicketDetails{
    tickets?:ITicket[];
    success?:boolean
}
export interface OrderFree{
    ticketCount:number;
            userId:string;
            eventId:string;
            eventTitle:string
            createdAt:Date
            orderId:string;
            status?:string;
            bookingStatus?:string;
}
export interface Ticket {
  _id: string|Types.ObjectId;
  qrToken: string;
}

export interface Order {
  orderId: string;
  eventTitle: string;
 
 
  ticketCount: number;
}

