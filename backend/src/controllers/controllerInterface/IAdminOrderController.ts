import { Request, Response } from "express";
export interface IAdminOrderController{
    getAllOrders(req:Request,res:Response):Promise<void>
<<<<<<< HEAD
    getDashboardOrders(req:Request,res:Response):Promise<void>;
    getOrderDetails(req:Request,res:Response):Promise<void>
=======
    getDashboardOrders(req:Request,res:Response):Promise<void>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

}