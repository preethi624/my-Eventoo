import { CreateEvent, EditEvent, EventGet, IEventFilter } from "src/interface/event";
import { IEvent } from "src/model/event";
import { IAdminEventService } from "./serviceInterface/IAdminEventService";
import { IAdminEventRepository } from "src/repositories/repositoryInterface/IAdminEventRepository";
import { GetUsers } from "src/interface/IUserAuth";
import { AdminDashboard } from "src/interface/IAdmin";


export class AdminEventService implements IAdminEventService{
    constructor(private adminEventRepository:IAdminEventRepository){}
    async getEvents(filters:IEventFilter):Promise<EventGet>{

try {
  
  
    const response=await this.adminEventRepository.getEventsAll(filters);
  
    

    
    if(response){
      return {response,success:true,message:"Users fetched successfully"}
    }else{
      return{success:false,message:"failed to fetch users"}
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }

}

async editEvent(id:string,formData:EditEvent):Promise<GetUsers>{
  try {
    const response=await this.adminEventRepository.eventEdit(id,formData);
   
    
    if(response){
      

   
      return{success:true,message:"Organiser edit successfully"}

    }else{
      return {success:false,message:"failed to edit organiser"}
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }

}

async eventBlock(event:IEvent):Promise<CreateEvent>{
  try {
    const response=await this.adminEventRepository.blockEvent(event);
    
    
    if(response){
      if(response.isBlocked){
        return {success:true,message:"Event blocked successfully"}

      }else{
        return {success:true,message:"Event unblocked successfully"}

      }
     

    }else{
      return {success:false,message:"failed to block"}
    }
  } catch (error) {

    console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }


}
async dashboardGet():Promise<AdminDashboard>{
  try {
    const response=await this.adminEventRepository.getDashboard();
  if(response){
    return{success:true,message:"fetched successfully",monthlyRevenue:response.monthlyRevenue,topEvents:response.topEvents,eventCategories:response.eventCategories,totalRevenue:response.totalRevenue,activeEvents:response.activeEvents}

  }else{
    return{success:false,message:"failed to fetch"}
  }
    
  } catch (error) {
     console.error('Login error:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
    
  }
  
}


}
