import { IOrganiserService } from "src/services/serviceInterface/IOrganiserService";
import { IOrganiserController } from "./controllerInterface/IOrganiserController";
import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeEnum";
import { ProfileEdit } from "src/interface/IUser";
import { ParsedQs } from "qs";
import { OrgVenueFilter } from "src/interface/IVenue";

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
    const searchTerm=req.query.searchTerm as string
    const status=req.query.status as string;
    const date=req.query.date as string
    console.log("date",date);
    
   
    
     const response=await this.organiserService.bookingFetch(organiserId,limit,page,searchTerm as string,status,date);
     
     
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
  async getVenues(req:Request,res:Response):Promise<void>{
  
  
      try {

       const query=req.query as ParsedQs;
                       const filters:OrgVenueFilter={
                         nameSearch:typeof query.nameSearch==='string'?query.nameSearch:'',
                           locationSearch:typeof query.locationSearch==='string'?query.locationSearch:'',
                          
                       page:query.page?Number(query.page):undefined,
                       limit: query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : undefined
                   
                   
                       }
                       
                       
        
        
     
        
       
   
    
     const response=await this.organiserService.venuesGet(filters);
     
     
        if(response.success){
          res.json({message:response.message,success:true,venues:response.venues,totalPages:response.totalPages,currentPage:response.currentPage})
        }else{
          res.json({message:"failed to fetch venues",success:false})
        }

        
      } catch (error) {
        console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        }); 
        
      }
      

    }  
   async getVenueById(req:Request,res:Response):Promise<void>{
  
  
      try {
       
        
        const venueId=req.params.venueId;
       
        
     
        
       
   
    
     const response=await this.organiserService.venueGetById(venueId);
     
     
        if(response.success){
          res.json({message:response.message,success:true,venue:response.venue})
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
    async getDashboard(req:Request,res:Response):Promise<void>{
  
  
      try {
       
        
        const eventId=req.params.eventId;
       
        
     
        
       
   
    
     const response=await this.organiserService.dashboardGet(eventId);
     
     
        if(response.success){
          res.json({message:response.message,success:true,data:response.data})
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
    async fetchAttendees(req:Request,res:Response):Promise<void>{
      try {
        const eventId=req.params.eventId;
        const organiserId=req.params.organiserId;
      const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : '';
      const filterStatus=typeof req.query.filterStatus==='string'?req.query.filterStatus:'';
        const response=await this.organiserService.attendeesFetch(eventId,organiserId,searchTerm,filterStatus);
        if(response.success){
          res.json({success:true,message:"fetched succeessfully",attendee:response.attendees,revenue:response.revenue})
        }else{
          res.json({success:false,message:"failed"})
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