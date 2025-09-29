
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
<<<<<<< HEAD
  Location,
  StatusCheck,
} from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";
import { Recommend } from "src/interface/IUser";
import { IEvent } from "src/model/event";
=======
  StatusCheck,
} from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

export interface IEventService {
  eventGet(filters: IEventFilter): Promise<EventGet>;
  eventGetById(id: string): Promise<EventById>;
  eventCreate(data: IEventDTO): Promise<CreateEvent>;
  eventDelete(id: string): Promise<CreateEvent>;
<<<<<<< HEAD
 eventEdit(id: string, data: EventEdit, file?: Express.Multer.File): Promise<IEvent| null>
=======
  eventEdit(id: string, data: EventEdit): Promise<CreateEvent>;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  statusCheck(email: object): Promise<StatusCheck>;
  getEvent(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
<<<<<<< HEAD
    date: string,
    status:string
=======
    date: string
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  ): Promise<EventGet>;
  eventCountGet(organiserId: string): Promise<EventCount>;
  getDashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d"
  ): Promise<DashboardEvents>;
  getEvents(organiserId: string): Promise<EventGet>;
  eventFind(eventName: string): Promise<EventFind>;
  eventsFindByCat(category: string): Promise<EventByCat>;
<<<<<<< HEAD
  getRecommended(userId:string,filters:IEventFilter):Promise<Recommend>
   nearFind({lat,lng}:Location,filters:IEventFilter):Promise<Recommend>
   completedGet(filters: IEventFilter): Promise<EventGet>
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}