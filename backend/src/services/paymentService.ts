import {  GetOrder, GetOrders, OrderCreate, OrderCreateInput, RazorpayPaymentResponse, Update, UserProfileUpdate, VerifyResponse } from "src/interface/IPayment";
import { IPaymentService } from "./serviceInterface/IPaymentService";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import Razorpay from "razorpay";
import { IPaymentRepository } from "src/repositories/repositoryInterface/IPaymentRepository";
import { IEventRepository } from "src/repositories/repositoryInterface/IEventRepository";
import { generateOrderId } from "../utils/generateOrderId";


const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});


export class PaymentService implements IPaymentService{
    constructor(private paymentRepository:IPaymentRepository,private eventRepository:IEventRepository ){}
    async orderCreate(data:OrderCreateInput):Promise<OrderCreate>{
        const orderId=generateOrderId()
        try {
           
            

            const totalPrice=data.totalPrice;
        const ticketCount=data.ticketCount;
        const userId=data.userId;
        const eventId=data.eventId;
        const eventTitle=data.eventTitle;
        const createdAt=new Date();
        
        const options={
            amount:totalPrice*100,
            currency:"INR",
            receipt: "receipt_order_74394"
        }
        const order=await razorpay.orders.create(options);
      
        
     
        const response=await this.paymentRepository.createOrder({
            razorpayOrderId:order.id,
            amount:Number(order.amount),
            currency:order.currency,
            receipt:order.receipt?? "default_receipt_id",
            status:order.status,
            ticketCount,
            userId,
            eventId,
            eventTitle,
            createdAt,
            orderId:orderId

        });
        if(response){
            return ({success:true,message:"order created successfully",order:response})
        }else{
            return({success:false,message:"failed to create order"})
        }



        
        
        

 
            
        } catch (error) {
             console.error(error);
        return { success: false, message: "not creating order" };

            
        }
       
    }
    async paymentVerify(data:RazorpayPaymentResponse):Promise<VerifyResponse>{
        try {
            const razorpay_payment_id=data.razorpay_payment_id;
 const  razorpay_order_id= data.razorpay_order_id;
  const razorpay_signature= data.razorpay_signature;
   const secret = process.env.RAZORPAY_KEY_SECRET;
   if (!secret) {
  throw new Error("RAZORPAY_KEY_SECRET is not defined in environment variables.");
}
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    if(generatedSignature===razorpay_signature){
        const updatedOrder=await this.paymentRepository.updatePaymentDetails(razorpay_order_id,razorpay_payment_id,razorpay_signature,'paid')
        if(updatedOrder){
            await this.eventRepository.decrementAvailableTickets(updatedOrder.eventId.toString(),updatedOrder.ticketCount)
            
        }else{
            console.warn("No matching order found for Razorpay Order ID:", razorpay_order_id);
        }
        return {success:true,message:"Payment verified successfully"}
    }else{
        await this.paymentRepository.updatePaymentDetails(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        'failed'
      );
        return {success:false,message:"Payment not verified"}
    }
            
        } catch (error) {

        console.error(error);
        if (data.razorpay_order_id) {
      await this.paymentRepository.updatePaymentDetails(
        data.razorpay_order_id,
        data.razorpay_payment_id || '',
        data.razorpay_signature || '',
        'failed'
      );
    }
        return { success: false, message: "Payment not verified" };

            
        }
 

    }
    async paymentFailure(payStatus:string,orderId:string,userId:string):Promise<VerifyResponse>{
        try {
             const response=await this.paymentRepository.failurePayment(payStatus,orderId,userId);
             if(response){
                return {success:true,message:"status updated"}
             }
             else{
                return {success:false,message:"failed to update status"}
             }
            
        } catch (error) {
            console.log(error);
            return {success:false,message:"failr=ed to update"}
            
            
        }
       


    }
    async ordersGet(id:string,limit:number,page:number,searchTerm:string,status:string):Promise<GetOrders>{
        try {
            const result=await this.paymentRepository.getOrders(id,limit,page,searchTerm,status);
            console.log("result",result);
            
           
            
            if(result){
                return {success:true,message:"orders fetched successfully",order:result}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
    }
    async orderGetById(userId:string,orderId:string):Promise<GetOrder>{
        try {
          const result=await this.paymentRepository.getOrderById(userId,orderId);
        if(result){
                return {success:true,message:"orders fetched successfully",order:result}
            }else{
                return {success:false,message:"failed to fetch"}
            }  

        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
            
        }
        
      async ordersGetById(userId:string):Promise<UserProfileUpdate>{
        try {
          const result=await this.paymentRepository.getOrdersById(userId);
        if(result){
                return {success:true,totalSpent:result.totalSpent,eventsBooked:result.eventsBooked}
            }else{
                return {success:false,message:"failed to fetch"}
            }  

        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
            
        }  
        async orderFind(orderId:string):Promise<Update>{
            try {
                const result=await this.paymentRepository.findOrder(orderId);
                if(result){
                    const paymentId=result.razorpayPaymentId;
                    const amount=result.amount;
                    const refund=await razorpay.payments.refund(paymentId,{amount:amount});
                    const refundId=refund.id
                    const response=await this.paymentRepository.updateRefund(refundId,orderId);
                    if(response.success){
                         return{success:true,refundId:refundId,message:"successfully updated"}

                    }else{

                      return {success:false,message:"failed to update"}
                    }
                   
                }else{
                    return {success:false,message:"failed to update"}
                }
                
            } catch (error) {
                console.error(error);
        return { success: false, message: "failed to update" };
            

            }
        }
     
    
}