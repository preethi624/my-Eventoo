import type { IEventDTO } from "./IEvent";
import type { IUser } from "./IUser";
export interface ITicketType {
  type: string;
  price: number;
  capacity: number;
  sold?:number;
  economic?:{price:number,cpacity:number};
  premium?:{price:number,capacity:number};
  vip?:{price:number,capacity:number}
  
  
  
}

export interface IOrder{
    _id:string

    userId:string|IUser;
    eventId:string|IEventDTO;
    amount:number;
    offerAmount:number;
    finalAmount:number;
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
    bookingStatus?:string|undefined;
    refundId?:string;
    bookingNumber:string
    ticketTypes?:ITicketType[]
    selectedTicket?:{type:string,capacity:number,price:number,sold?:number}|null
   
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



