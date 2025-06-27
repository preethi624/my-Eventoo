import { EditEvent, GetEvent, IEventFilter } from "src/interface/event";
import { AdminDashboard } from "src/interface/IAdmin";
import { IEvent } from "src/model/event";

export interface IAdminEventRepository{

getEventsAll(filters:IEventFilter):Promise<GetEvent|null>;
    
    eventEdit(id:string,formData:EditEvent):Promise<IEvent|null>;
    blockEvent(event:IEvent):Promise<IEvent|null>;
     getDashboard():Promise<AdminDashboard>;

}