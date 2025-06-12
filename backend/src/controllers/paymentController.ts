import { Request, Response } from "express";
import {  OrderCreateInput, RazorpayPaymentResponse } from "src/interface/IPayment";
import { IPaymentController } from "./controllerInterface/IPaymentController";
import { IPaymentService } from "src/services/serviceInterface/IPaymentService";

import { StatusCode } from "../constants/statusCodeEnum";
export class PaymentController implements IPaymentController{
    constructor(private paymentService:IPaymentService){}
    async createOrder(req:Request,res:Response):Promise<void>{
        try {

          
          
             const data:OrderCreateInput=req.body;
       
             
        const response=await this.paymentService.orderCreate(data);
       
        
        if(response.success&&response.order){

            res.json({message:"order created",success:true,order:response.order})
        }else{
    res.json({success:false,message:"failed to create order"})
  }
            
        } catch (error) {
            console.error("Error in createOrder:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      
      });
        }
       
 



    }
    async verifyPayment(req:Request,res:Response):Promise<void>{
      try {
        const data:RazorpayPaymentResponse=req.body;
        const response=await this.paymentService.paymentVerify(data);
        if(response.success){
          res.json({message:"Payment verified successfully",success:true})
        }else{
          res.json({success:false,message:"Payment verification failed"})
        }
        
      } catch (error) {
          
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 
      }
    }
     async failurePayment(req:Request,res:Response):Promise<void>{
      try {
        const {payStatus,orderId,userId}=req.body;
        const response=await this.paymentService.paymentFailure(payStatus,orderId,userId);
        if(response.success){
          res.json({message:"failure status updated successfully",success:true})
        }else{
          res.json({success:false,message:"status updation failed failed"})
        }
        
      } catch (error) {
          
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 
      }
    }
    async getOrders(req:Request,res:Response):Promise<void>{
      try {
        const id=req.params.id;
         const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const searchTerm=req.query.searchTerm as string
    const status=req.query.status as string
  
    

        const response=await this.paymentService.ordersGet(id,limit,page,searchTerm as string,status);
        if(response.success){
          res.json({message:response.message,success:true,order:response.order})
        }else{
          res.json({message:"failed to fetch orders",success:false})
        }
        
      } catch (error) {
        console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 
        
      }

    }
    async getOrderById(req:Request,res:Response):Promise<void>{
      try {
        const {userId,orderId}=req.params;
      const response=await this.paymentService.orderGetById(userId,orderId);
       if(response.success){
        
       
  
          res.json({message:response.message,success:true,order:response.order})
        }else{
          res.json({message:"failed to fetch orders",success:false})
        }
        
      } catch (error) {
        console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 

        
      }
      

    }
    async getOrdersById(req:Request,res:Response):Promise<void>{
      try {
        const userId=req.params.userId
        const response=await this.paymentService.ordersGetById(userId);
        if(response){
          res.json( {totalSpent:response.totalSpent,eventsBooked:response.eventsBooked})
        }
        
        
      } catch (error) {

         console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 
      }

    }
   
}