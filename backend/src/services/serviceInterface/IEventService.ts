
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
import { IEventDTO } from "src/interface/IEventDTO";
import { Recommend } from "src/interface/IUser";

export interface IEventService {
  eventGet(filters: IEventFilter): Promise<EventGet>;
  eventGetById(id: string): Promise<EventById>;
  eventCreate(data: IEventDTO): Promise<CreateEvent>;
  eventDelete(id: string): Promise<CreateEvent>;
  eventEdit(id: string, data: EventEdit): Promise<CreateEvent>;
  statusCheck(email: object): Promise<StatusCheck>;
  getEvent(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    date: string
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
}