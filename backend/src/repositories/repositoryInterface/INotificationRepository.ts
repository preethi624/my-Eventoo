import { INotification } from "src/interface/INotification";

export interface INotificationRepository{
    fetchNotification(id:string):Promise<INotification[]|null>
    markRead(id:string):Promise<INotification|null>
}