import { Request, Response } from "express";
import { INotificationController } from "./controllerInterface/INotificationController";
import { INotificationService } from "src/services/serviceInterface/INotificationService";
import { AuthenticatedRequest } from "src/interface/AuthenticatedRequest";


export class NotificationController implements INotificationController{
    constructor(private _notificationService:INotificationService){}
    async fetchNotifications(req:AuthenticatedRequest,res:Response):Promise<void>{
        const userId=req.user?.id
        console.log("orgId",userId);
        
        try {
            if(!userId) throw new Error("userId not found")
            const response=await this._notificationService.notificationFetch(userId);
            if(response.success){
                res.json({success:true,notifications:response.notifications})
            }else{
                res.json({success:false})
            }
            
        } catch (error) {
            console.log(error);
            
            
        }
    }
    async markRead(req:Request,res:Response):Promise<void>{
        const id=req.params.id
        try {
            const response=await this._notificationService.readMark(id);
            if(response.success){
                res.json({success:true})
            }else{
                res.json({success:false})
            }
            
        } catch (error) {
            console.log(error);
            
            
        }
    }
}