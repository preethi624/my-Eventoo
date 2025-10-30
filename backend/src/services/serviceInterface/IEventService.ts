
import {
  CreateEvent,
  DashboardEvents,
  EventByCat,
  EventById,
  EventCount,
  EventEdit,
  EventFind,
  EventGet,
  IEventFilter,
  Location,
  StatusCheck,
} from "src/interface/event";
import { IEventDTO, IEventImage } from "src/interface/IEventDTO";
import { Recommend } from "src/interface/IUser";
import { IEvent } from "src/model/event";


export interface IEventService {
  eventGet(filters: IEventFilter): Promise<EventGet>;
  eventGetById(id: string): Promise<EventById>;
  eventCreate(data: IEventDTO): Promise<CreateEvent>;
  eventDelete(id: string): Promise<CreateEvent>;
 eventEdit(id: string, data: EventEdit, file?: Express.Multer.File): Promise<IEvent| null>
  statusCheck(email: object): Promise<StatusCheck>;
  getEvent(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    date: string,
    status:string
  ): Promise<EventGet>;
  eventCountGet(organiserId: string): Promise<EventCount>;
  getDashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d"
  ): Promise<DashboardEvents>;
  getEvents(organiserId: string): Promise<EventGet>;
  eventFind(eventName: string): Promise<EventFind>;
  eventsFindByCat(category: string): Promise<EventByCat>;
  getRecommended(userId:string,filters:IEventFilter):Promise<Recommend>
   nearFind({lat,lng}:Location,filters:IEventFilter):Promise<Recommend>
   completedGet(filters: IEventFilter): Promise<EventGet>
    getEventsAll():Promise<{images:(string | IEventImage)[],title:string}[]>
     trendingGet():Promise<{images:(string | IEventImage)[],title:string}[]>
  eventReschedule(date: string, eventId: string, organiserId: string):Promise<{success:boolean,message:string}>
}