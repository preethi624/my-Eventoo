import { IOrganiserService } from "src/services/serviceInterface/IOrganiserService";
import { IOrganiserController } from "./controllerInterface/IOrganiserController";
import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeEnum";
import { ProfileEdit } from "src/interface/IUser";

export class OrganiserController implements IOrganiserController{
    constructor(private organiserService:IOrganiserService ){}
    async getOrgById(req:Request,res:Response):Promise<void>{
  try {
    const id=req.params.id;
 
    
   
   
    
    const response=await this.organiserService.orgGetById(id);
   
    
    if(response){
      
      res.json({result:response,success:true})
      
    }else{
      res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: "No events found",
      });
    }
    
  } catch (error) {
    console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch organiser",
    });
    
  }


}
async checkStatus(req:Request<unknown,unknown,object>,res:Response):Promise<void>{
  try {
    const result=req.body;

   
    
   const response=await this.organiserService.statusCheck(result);
  if(response){
    res.json({user:response,success:true})
   
  }else{
    res.json({success:false})

  } 
    
  } catch (error) {
    console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create event",
    });
    
  }
  
  
  

}
async updateOrganiser(req:Request<{organiserId:string},unknown,ProfileEdit>,res:Response):Promise<void>{
    try {
           const { name, email, phone, location, aboutMe } = req.body;
        const organiserId=req.params.organiserId
        const image=req.file?.filename;
   
        
        const data = {
      name,
      email,
      phone,
      location,
      aboutMe,
      profileImage: image, 
    };
    const response=await this.organiserService.organiserUpdate(data,organiserId);
    if(response.success){
        res.json({result:response.result,success:true,message:"organiser updated "})
    }else{
        res.json({success:false,message:"failed to update"})
    }
        
    } catch (error) {
        console.log(error);
        
        
    }
    

}
 async fetchBooking(req:Request,res:Response):Promise<void>{
      try {
       
        
        const organiserId=req.params.organiserId;
     
        
         const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
   
    
     const response=await this.organiserService.bookingFetch(organiserId,limit,page);
     
     
        if(response.success){
          res.json({message:response.message,success:true,result:response.result,totalPages:response.totalPages,currentPage:response.currentPage})
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

async getOrderDetails(req:Request,res:Response):Promise<void>{
  console.log("controller hit");
  
      try {
       
        
        const orderId=req.params.orderId;
        console.log("contr orderid",orderId);
        
     
        
       
   
    
     const response=await this.organiserService.orderGetDetails(orderId);
     
     
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
    async orgReapply(req:Request,res:Response):Promise<void>{
      try {
        const organiserId=req.params.orgId;
      const response=await this.organiserService.reapplyOrg(organiserId);
      if(response.success){
        res.json({success:true,message:response.message})
      }else{
        res.json({success:false,message:response.message})
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