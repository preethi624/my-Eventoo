import { IMessageService } from "src/services/serviceInterface/IMessageService";
import { Request, Response } from "express";

export class MessageController{
    constructor(private _messageService:IMessageService){};
    async getMessages(req:Request,res:Response):Promise<void>{
        const {orgId,userId}=req.params
        try {
            const response=await this._messageService.messagesGet(orgId,userId);
            if(response.success){
                res.json({sucess:true,messages:response.messages})
            }else{
                res.json({success:false})
            }


            
        } catch (error) {
            console.log(error);
            
            
        }
    }




}