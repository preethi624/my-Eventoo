import { Request, Response } from "express";
export interface INotificationController{
    fetchNotifications(req:Request,res:Response):Promise<void>;
    markRead(req:Request,res:Response):Promise<void>

}