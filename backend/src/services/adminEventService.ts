import { CreateEvent, EditEvent, EventGet } from "src/interface/event";
import { IEvent } from "src/model/event";
import { IAdminEventService } from "./serviceInterface/IAdminEventService";
import { IAdminEventRepository } from "src/repositories/repositoryInterface/IAdminEventRepository";
import { GetUsers } from "src/interface/IUserAuth";


export class AdminEventService implements IAdminEventService{
    constructor(private adminEventRepository:IAdminEventRepository){}
    async getEvents():Promise<EventGet>{

try {
    const result:IEvent[]=await this.adminEventRepository.getEventsAll();
    if(result){
      return {result:result,success:true,message:"Users fetched successfully"}
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


}
