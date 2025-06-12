import { EditEvent } from "src/interface/event";
import { IEvent } from "src/model/event";

export interface IAdminEventRepository{
    getEventsAll():Promise<IEvent[]>;
    eventEdit(id:string,formData:EditEvent):Promise<IEvent|null>;
    blockEvent(event:IEvent):Promise<IEvent|null>;
}