import type { IEventDTO } from "./IEvent";
<<<<<<< HEAD
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
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

export interface IOrder{
    _id:string

<<<<<<< HEAD
    userId:string|IUser;
=======
    userId:string;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
    bookingStatus?:string|undefined;
<<<<<<< HEAD
    refundId?:string;
    bookingNumber:string
    ticketTypes?:ITicketType[]
    selectedTicket?:{type:string,capacity:number,price:number,sold?:number}|null
=======
    refundId?:string
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
   
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



