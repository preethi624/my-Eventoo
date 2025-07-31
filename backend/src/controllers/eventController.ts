import { IEventDTO } from "src/interface/IEventDTO";
import { IEventService } from "../services/serviceInterface/IEventService";
import { IEventController } from "./controllerInterface/IEventController";
import { Request, Response } from "express";
import { EventEdit, IEventFilter } from "src/interface/event";
import {ParsedQs} from 'qs'

import { StatusCode } from "../constants/statusCodeEnum";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}


export class EventController implements IEventController{
    constructor(private eventService:IEventService){}

    async getEvents(req: Request, res: Response): Promise<void>{
  try {
    const query=req.query as ParsedQs;
    const filters:IEventFilter={
      searchLocation:typeof query.searchLocation==='string'?query.searchLocation:'',
        searchTitle:typeof query.searchTitle==='string'?query.searchTitle:'',
      selectedCategory:typeof query.selectedCategory==='string'?query.selectedCategory:'',
      maxPrice:query.maxPrice? Number(query.maxPrice):undefined,
      selectedDate:typeof query.selectedDate==='string'?query.selectedDate:'',
    page:query.page?Number(query.page):undefined,
    limit:query.limit?Number(query.limit):undefined


    }

    const result = await this.eventService.eventGet(filters);
  
    

    if (result) {
    
      res.json({ result: result, success: true });
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
      message: "Failed to fetch events",
    });
  }
};
 async getEventById(req:Request, res:Response):Promise<void> {
    try {
        const id = req.params.id;
        const response = await  this.eventService.eventGetById(id);
        if (response) {
            res.json({ result: response, success: true });
        }
        else {
            res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No events found",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
    }
};
async createEvent(req: Request<unknown, unknown, IEventDTO>, res: Response):Promise<void>{
  try {
  

    
const files = req.files as Express.Multer.File[];

    const eventData = {
      ...req.body,
      images: files?.map((file: Express.Multer.File) => file.path) || []
    };
   
    
    
    const response=await this.eventService.eventCreate(eventData)
    if(response.success){
      res.json({success:true,message:"Event created successfully"})
    }else{
      res.json({success:false,message:"Failed to create event"})
    }
    
    
  } catch (error) {
    console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create event",
    });
   
    
  }


}
async deleteEvent(req: Request, res: Response):Promise<void>{
  try {
    const id=req.params.id;
    console.log("id",id);
    
   
    
  const response=await this.eventService.eventDelete(id);
  if(response.success){
    res.json({success:true,messge:"event deleted"})

  }else{
    res.json({success:false,message:"failed to delete event"})
  }
 
      
   
    
  

    
  } catch (error) {

    console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete event",
    });
  }
  

}
async editEvent(req: Request<{id:string}, unknown, EventEdit>, res: Response):Promise<void>{
  try {
    console.log("req",req.body);
    
     const data=req.body;
  const id=req.params.id;
  const response=await this.eventService.eventEdit(id,data);
  if(response.success){
      res.json({success:true,message:"Event edited successfully"})
    }else{
      res.json({success:false,message:"Failed to edit event"})
    }

    
  } catch (error) {
    console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create event",
    });
    
  }
 
}
async checkStatus(req:Request<unknown,unknown,object>,res:Response):Promise<void>{
  try {
    const result=req.body;

   
    
   const response=await this.eventService.statusCheck(result);
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
async eventGet(req:Request, res:Response):Promise<void> {
    try {
        const id = req.params.id;
   const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const searchTerm=req.query.searchTerm as string;
    const date=req.query.date as string


        const response = await  this.eventService.getEvent(id,limit,page,searchTerm,date);
        console.log("response",response);
        
        if (response) {
            res.json({ result: response, success: true });
        }
        else {
            res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No events found",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
    }
};
async getEventCount(req:AuthenticatedRequest, res:Response):Promise<void> {
    try {
        const organiserId = req.user?.id;
        if(!organiserId){
          throw new Error("organiserId not get")
        }
        const response = await  this.eventService.eventCountGet(organiserId);
        if (response) {
            res.json({ result: response, success: true });
        }
        else {
            res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No events found",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
    }
};
async getDashboardEvents(req:Request,res:Response):Promise<void>{
  try {
    const organiserId=req.params.organiserId as string||'';
    const timeFrame = req.query.timeFrame as '7d' | '30d' | '90d' || '30d';
  const response=await this.eventService.getDashboardEvents(organiserId,timeFrame);

  
  if(response.success){
    res.json({success:true,events:response.events,data:response.data,adminPercentage:response.adminPercentage,organiserEarning:response.organiserEarning,totalEvents:response.totalEvents,totalAttendees:response.totalAttendees,topEvents:response.topEvents,upcomingEvents:response.upcomingEvents})
  }
  else{
     res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No events found",
            });
  }
    
  } catch (error) {
   console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
    } 
    
  }
  async getOrgEvents(req:Request,res:Response):Promise<void>{
    try {
      const organiserId=req.params.orgId as string||'';
      const response=await this.eventService.getEvents(organiserId);
      if (response) {
            res.json({ events: response.result, success: true });
        }
        else {
            res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No events found",
            });
        }


      
    } catch (error) {

      console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
    }
    

  }
  async findEvent(req:Request,res:Response):Promise<void>{
    const eventName=req.query.name as string;
    try {
      const response=await this.eventService.eventFind(eventName);
      if(response.success){
        res.json({result:response.result})
      }else{
        res.json({success:false})
      }
      
    } catch (error) {
      console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
      
    }
  }
  async findEventsByCat(req:Request,res:Response):Promise<void>{
   const category=req.query.name as string;
    try {
      const response=await this.eventService.eventsFindByCat(category);
      if(response.success){
        res.json({result:response.result})
      }else{
        res.json({success:false})
      }
      
    } catch (error) {
      console.error(error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch events",
        });
      
    }
  }
  


}