import { IMessageService } from "src/services/serviceInterface/IMessageService";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config()

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
    async postMessages(req:Request,res:Response):Promise<void>{
        try {
           
            const file=req.file
             if (!file) {
        res.status(400).json({ success: false, message: "Missing data" });
        return
      }
      const response=await this._messageService.postMessage(file)
      if(response){
       

        //const fullUrl = `${req.protocol}://${req.get("host")}${response.fileUrl}`;
        const fullUrl = `${process.env.BACKEND_BASEURL}${response.fileUrl}`;

       
       
        
      res.json({ success: true, fileUrl: fullUrl })

      }else{
        res.json({success:false})
      }

            
        } catch (error) {
            console.log(error);
            res.json({success:false})
            
            
        }
    }




}