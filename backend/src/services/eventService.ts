
import { IEventService } from "./serviceInterface/IEventService";
import { IEventRepository } from "../repositories/repositoryInterface/IEventRepository";
import { CreateEvent, DashboardEvents, EventById, EventCount, EventEdit, EventGet, IEventFilter, StatusCheck } from "../interface/event";
import { IEventDTO } from "src/interface/IEventDTO";

export class EventService implements IEventService{
    constructor(private eventRepository:IEventRepository){}
    async eventGet(filters:IEventFilter):Promise<EventGet>{
    try {
        const response=await this.eventRepository.getEvents(filters);
       
        
    if(response){
        
        
        return {response,success:true,message:"Event fetched successfully"}
    }else {
        return { success: false, message: "No events found" }; 
      } 
        
    } catch (error) {
        console.error(error);
    return { success: false, message: "not getting events" };
        
    }
   

}
async eventGetById (id:string):Promise<EventById>{
    try {
        const result = await this.eventRepository.getEventById(id);
        if (result) {
            return { result, success: true ,message:"Event fetched successfully"};
        }
        else {
            return { success: false, message: "No event found" };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: "not getting event" };
    }
};
async eventCreate(data:IEventDTO):Promise<CreateEvent>{
    try {
        
        
       
        
      
        
        
        const result=await this.eventRepository.createEvent(data);
        
        
        if(result){
            return{success:true,message:"Event created successfully"}
        }else{
            return{success:false,message:"Failed t create event"}
        }
        
    } catch (error) {

        console.error(error);
        return { success: false, message: "not creating event" };
    }



}
async eventDelete(id:string):Promise<CreateEvent>{
    try {
        
        
        const result=await this.eventRepository.eventDelete(id);
    if(result){
        return {success:true,message:"event deleted successfully"}
    }else{

return {success:false,message:"event not deleted"}
    }
        
    } catch (error) {
        console.log(error);
        
        return {success:false,message:"failed to delete event"}
        
    }
    

}
async eventEdit(id:string,data:EventEdit):Promise<CreateEvent>{
    try {
        const result=await this.eventRepository.editEvent(id,data);
        if(result){
            return {success:true,message:"event edited successfully"}
        }else{
            return {success:false,message:"faled to edit"}
        }
        
    } catch (error) {
        console.log(error);
        
         return {success:false,message:"failed to edit event"}
        
        
    }
}
async statusCheck(email:object):Promise<StatusCheck>{
    try {
        const result=await this.eventRepository.statusCheck(email);
        if(result){
            return {result:result,success:true}
        }else{
            return {success:false}
        }
    } catch (error) {
        console.error(error);
        return {success:false}
        
    }
}
async getEvent (id:string,limit:number,page:number,searchTerm:string,date:string):Promise<EventGet>{
    try {
        const response = await this.eventRepository.eventGet(id,limit,page,searchTerm,date);
      
        
       
        
       
        
        if (response) {
            return { response, success: true ,message:"Event fetched successfully"};
        }
        else {
            return { success: false, message: "No event found" };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, message: "not getting event" };
    }
};
async eventCountGet (organiserId:string):Promise<EventCount>{
    try {
        const result = await this.eventRepository.getEventCount(organiserId);
        if (result) {
            return { count:result, success: true};
        }
        else {
            return { success: false};
        }
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
};
async getDashboardEvents(organiserId:string,timeFrame:'7d' | '30d' | '90d'):Promise<DashboardEvents>{
    try {
        const response=await this.eventRepository.dashboardEvents(organiserId,timeFrame);
        if(response){
            return {success:true,events:response.events,message:"event fetched successfully",data:response.data,adminPercentage:response.adminCommissionPercentage,organiserEarning:response.organiserEarning,totalEvents:response.totalEvents,totalAttendees:response.totalAttendees,topEvents:response.topEvents,upcomingEvents:response.upcomingEvents}
        }else{
            return {success:false,message:"failed to fetch events"}
        }
        
    } catch (error) {
         console.error(error);
        return { success: false ,message:"failed"};
        
    }
}
async getEvents(organiserId:string):Promise<EventGet>{
    try {
        const response=await this.eventRepository.getOrgEvents(organiserId);
        if(response){
            return {success:true,result:response,message:"event fetched successfully"}
        }else{
            return {success:false,message:"failed"}
        }

        
    } catch (error) {
         console.error(error);
        return { success: false ,message:"failed"};
        
    }
}

}