import { IEvent } from "src/model/event";
import { IOrder } from "src/model/order";

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
    eventTitle:string
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
