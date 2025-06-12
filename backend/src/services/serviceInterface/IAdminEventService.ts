import { CreateEvent, EditEvent, EventGet } from "src/interface/event";
import { GetUsers } from "src/interface/IUserAuth";
import { IEvent } from "src/model/event";

export interface IAdminEventService{
    getEvents():Promise<EventGet>;
    editEvent(id:string,formData:EditEvent):Promise<GetUsers>;
    eventBlock(event:IEvent):Promise<CreateEvent>
}