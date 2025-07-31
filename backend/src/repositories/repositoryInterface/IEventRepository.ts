import { DeleteResult } from "mongoose";
import { EventEdit, GetEvent, IEventFilter } from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";
import { IUser } from "src/interface/IUserAuth";
import { IEvent } from "src/model/event";

export interface IEventRepository{
     getEvents(filters:IEventFilter):Promise<GetEvent|null>;
     getEventById(id:string):Promise<IEvent|null>;
     createEvent(data:IEventDTO):Promise<IEvent>;
     eventDelete(id:string):Promise<DeleteResult>;
     editEvent(id:string,data:EventEdit):Promise<IEvent|null>;
     statusCheck(email:object):Promise<IUser|null>;
      decrementAvailableTickets(eventId:string,ticketCount:number):Promise<void>;
      eventGet(id:string,limit:number,page:number,searchTerm:string,date:string):Promise<GetEvent|null>;
       getEventCount(organiserId:string):Promise<number|null>;
       dashboardEvents(organiserId:string,timeFrame:'7d' | '30d' | '90d'):Promise<{
  events: IEvent[],
  data: {
    month: number,
    revenue: number,
    events: number
  }[],adminCommissionPercentage:number,organiserEarning:number,totalEvents:number,totalAttendees:number,topEvents:IEvent[],upcomingEvents:IEvent[]
}>
getOrgEvents(organiserId:string):Promise<IEvent[]>
findEvent(eventName:string):Promise<IEvent|null>
findEventsByCat(category:string):Promise<IEvent[]>

    
}