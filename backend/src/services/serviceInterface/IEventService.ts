
import { CreateEvent, DashboardEvents, EventById, EventCount, EventEdit, EventGet, IEventFilter, StatusCheck } from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";


export interface IEventService{
      eventGet(filters:IEventFilter):Promise<EventGet>
       eventGetById (id:string):Promise<EventById>;
       eventCreate(data:IEventDTO):Promise<CreateEvent>;
       eventDelete(id:string):Promise<CreateEvent>;
       eventEdit(id:string,data:EventEdit):Promise<CreateEvent>;
       statusCheck(email:object):Promise<StatusCheck>;
        getEvent (id:string,limit:number,page:number,searchTerm:string,date:string):Promise<EventGet>
        eventCountGet (organiserId:string):Promise<EventCount>;
        getDashboardEvents(organiserId:string,timeFrame:'7d' | '30d' | '90d'):Promise<DashboardEvents>
        getEvents(organiserId:string):Promise<EventGet>
    
}