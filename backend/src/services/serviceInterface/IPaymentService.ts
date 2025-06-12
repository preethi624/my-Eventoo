import { GetOrder, GetOrders, OrderCreate, OrderCreateInput, RazorpayPaymentResponse, UserProfileUpdate, VerifyResponse } from "src/interface/IPayment";
export interface IPaymentService{
    orderCreate(data:OrderCreateInput):Promise<OrderCreate>;
    paymentVerify(data:RazorpayPaymentResponse):Promise<VerifyResponse>;
  ordersGet(id:string,limit:number,page:number,searchTerm:string,status:string):Promise<GetOrders>;
  orderGetById(userId:string,orderId:string):Promise<GetOrder>;
  paymentFailure(payStatus:string,orderId:string,userId:string):Promise<VerifyResponse>;
  ordersGetById(userId:string):Promise<UserProfileUpdate>;
 


}