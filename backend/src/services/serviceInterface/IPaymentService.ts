import { GetOrder, GetOrders, GetTickets, OrderCreate, OrderCreateInput, RazorpayPaymentResponse,  Update, UserProfileUpdate, VerifyResponse } from "src/interface/IPayment";
import { ITicketDetails } from "src/interface/ITicket";
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
   ticketDetailsGet(userId:string,searchTerm:string,status:string,page:string,limit:string):Promise<ITicketDetails>
 


}