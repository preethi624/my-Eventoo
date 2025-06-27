import { CreateEvent, EditEvent, EventGet, IEventFilter } from "src/interface/event";
import { AdminDashboard } from "src/interface/IAdmin";
import { GetUsers } from "src/interface/IUserAuth";
import { IEvent } from "src/model/event";

export interface IAdminEventService{
    getEvents(filters:IEventFilter):Promise<EventGet>
    editEvent(id:string,formData:EditEvent):Promise<GetUsers>;
    eventBlock(event:IEvent):Promise<CreateEvent>;
    dashboardGet():Promise<AdminDashboard>
}