import { IPaymentDTO, OrderFree, OrdersGet, Update, UserProfileUpdate } from "src/interface/IPayment";
import { IOrder } from "src/model/order";
import { ITicket } from "src/model/ticket";

export interface IPaymentRepository{
    createOrder(data:IPaymentDTO):Promise<IOrder>;
  createOrderFree(data:OrderFree):Promise<IOrder>
    updatePaymentDetails(orderId:string,paymentId:string,signature:string,status:string):Promise<IOrder|null>;
    getOrders(id:string,lmit:number,page:number,searchTerm:string,status:string):Promise<OrdersGet>;
    getOrderById(userId:string,orderId:string):Promise<IOrder|null>;
    failurePayment(payStatus:string,orderId:string,userId:string):Promise<IOrder|null>;
     getOrdersById(userId:string):Promise<UserProfileUpdate>;
     findOrder(orderId:string):Promise<IOrder|null>;
     updateRefund(refundId:string,orderId:string):Promise<Update>
     getTickets(orderId:string):Promise<ITicket[]>;
     getTicketDetails(userId: string,searchTerm:string,status:string):Promise<ITicket[]>
   
}