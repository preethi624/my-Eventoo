import { Request, Response } from "express";
export interface IPaymentController{
    createOrder(req:Request,res:Response):Promise<void>;
    verifyPayment(req:Request,res:Response):Promise<void>;
    getOrders(req:Request,res:Response):Promise<void>;
    getOrderById(req:Request,res:Response):Promise<void>;
    failurePayment(req:Request,res:Response):Promise<void>;
   
   
}