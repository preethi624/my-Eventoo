import type { IEventDTO } from "./IEvent";

export interface IOrder{
    _id:string

    userId:string;
    eventId:string|IEventDTO;
    amount:number;
    currency:string;
    status:string;
    razorpayOrderId:string;
    razorpaySignature:string;
    razorpayPaymentId:string;
    eventTitle:string;
    ticketCount:number;
    createdAt:Date;
    eventDetails:IEventDTO;
    orders?:IOrder;
    orderId:string;
   
}
export interface IGetOrdersResponse {
  success: boolean;
  message: string;
  order?: {
    orders: IOrder[];
    totalPages: number;
    currentPage: number;
  };
}



