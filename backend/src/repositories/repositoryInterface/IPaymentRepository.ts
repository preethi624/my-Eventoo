import { IPaymentDTO, OrdersGet, UserProfileUpdate } from "src/interface/IPayment";
import { IOrder } from "src/model/order";

export interface IPaymentRepository{
    createOrder(data:IPaymentDTO):Promise<IOrder>;
    updatePaymentDetails(orderId:string,paymentId:string,signature:string,status:string):Promise<IOrder|null>;
    getOrders(id:string,lmit:number,page:number,searchTerm:string,status:string):Promise<OrdersGet>;
    getOrderById(userId:string,orderId:string):Promise<IOrder|null>;
    failurePayment(payStatus:string,orderId:string,userId:string):Promise<IOrder|null>;
     getOrdersById(userId:string):Promise<UserProfileUpdate>;
   
}