
import { CreateEvent, EventById, EventCount, EventEdit, EventGet, IEventFilter, StatusCheck } from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";


export interface IEventService{
      eventGet(filters:IEventFilter):Promise<EventGet>
       eventGetById (id:string):Promise<EventById>;
       eventCreate(data:IEventDTO):Promise<CreateEvent>;
       eventDelete(id:string):Promise<CreateEvent>;
       eventEdit(id:string,data:EventEdit):Promise<CreateEvent>;
       statusCheck(email:object):Promise<StatusCheck>;
        getEvent (id:string,limit:number,page:number):Promise<EventGet>
        eventCountGet (organiserId:string):Promise<EventCount>
    
}