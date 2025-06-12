import { Request, Response } from "express";
import { IAdminEventController } from "./controllerInterface/IAdminEventController";
import { IAdminEventService } from "src/services/serviceInterface/IAdminEventService";
import { EditEvent } from "src/interface/event";
import { IEvent } from "src/model/event";
import { StatusCode } from "../constants/statusCodeEnum";
export class AdminEventController implements IAdminEventController{
    constructor(private adminEventService:IAdminEventService){};
    async getAllEvents(req:Request,res:Response):Promise<void>{
  try {
    const result=await this.adminEventService.getEvents();
  if(result.success){
    res.json({result:result.result,message:result.message,success:true})
  }else{
    res.json({message:result.message,success:false})

  } 

    
  } catch (error) {
    console.log(error);
    

     res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
  }



}
async eventEdit(req: Request<{id:string}, unknown,EditEvent>,  res: Response):Promise<void>{
  try {
    const id=req.params.id;
    const formData=req.body;
    const result=await this.adminEventService.editEvent(id,formData);
    if(result.success){
      res.json({success:true,message:"edited successfully"})
      return
    }else{
      res.json({success:false,message:"failed to edit"})
    }
    
  } catch (error) {
    console.log(error);
    
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
    
  }
  

}

async blockEvent(req: Request<unknown, unknown,IEvent>,  res: Response):Promise<void>{
  try {
  
    const event=req.body;
    const result=await this.adminEventService.eventBlock(event);
   
    
    if(result.success){
      res.json({success:true,message:result.message})
    }else{
      res.json({success:false,message:result.message})
    }

    
  } catch (error) {
    console.log(error);
    
    
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
 
  

}
  
}
    
}