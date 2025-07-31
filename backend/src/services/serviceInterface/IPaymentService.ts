import { GetOrder, GetOrders, GetTickets, OrderCreate, OrderCreateInput, RazorpayPaymentResponse, TicketDetails, Update, UserProfileUpdate, VerifyResponse } from "src/interface/IPayment";
export interface IPaymentService{
    orderCreate(data:OrderCreateInput):Promise<OrderCreate>;
     orderCreateFree(data:OrderCreateInput):Promise<{success?:boolean}>
    paymentVerify(data:RazorpayPaymentResponse):Promise<VerifyResponse>;
  ordersGet(id:string,limit:number,page:number,searchTerm:string,status:string):Promise<GetOrders>;
  orderGetById(userId:string,orderId:string):Promise<GetOrder>;
  paymentFailure(payStatus:string,orderId:string,userId:string):Promise<VerifyResponse>;
  ordersGetById(userId:string):Promise<UserProfileUpdate>;
  orderFind(orderId:string):Promise<Update>;
  ticketsGet(orderId:string):Promise<GetTickets>;
   ticketDetailsGet(userId:string,searchTerm:string,status:string):Promise<TicketDetails>
 


}