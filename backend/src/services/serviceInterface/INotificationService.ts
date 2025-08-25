import { FetchNotification } from "src/interface/INotification";

export interface INotificationService{
    notificationFetch(id:string):Promise<FetchNotification>
    readMark(id:string):Promise<{success:boolean}>
}