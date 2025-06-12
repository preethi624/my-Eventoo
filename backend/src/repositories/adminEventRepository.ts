import { EditEvent } from "src/interface/event";
import EventModel, { IEvent } from "../model/event";
import { IAdminEventRepository } from "./repositoryInterface/IAdminEventRepository";

export class AdminEventRepository implements IAdminEventRepository{
    async getEventsAll():Promise<IEvent[]>{
        return await EventModel.find()

    }
     async eventEdit(id:string,formData:EditEvent):Promise<IEvent|null>{
        return await EventModel.findByIdAndUpdate(id,formData,{new:true})

    }
    async blockEvent(event:IEvent):Promise<IEvent|null>{
        const id=event._id
        if(!event.isBlocked){

            return await EventModel.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        }else{
            return await EventModel.findByIdAndUpdate(id,{isBlocked:false},{new:true})

        }


}
    
    
}