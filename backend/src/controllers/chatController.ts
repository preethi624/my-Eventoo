import { Request, Response } from "express";

import { IChatController } from "./controllerInterface/IChatController";
import { IChatService } from "src/services/serviceInterface/IChatService";
import { StatusCode } from "../constants/statusCodeEnum";
export class ChatController implements IChatController{
    constructor(private chatService:IChatService){}
    async createChat(req:Request<unknown,unknown,string>,res:Response):Promise<void>{
        try {
          
            
            const message=req.body;
        const response=await this.chatService.chatCreate(message);
        if(response.success){
            res.json({success:true,message:'chat successfully',response:response.result})

        }else{
            res.json({success:false,message:"failed to chat"})
        }
            
        } catch (error) {
            console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to chat",
    });

            
        }
        

    }
}