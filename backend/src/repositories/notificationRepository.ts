import { INotification } from "src/interface/INotification";
import Notification from "../model/notification";
import { INotificationRepository } from "./repositoryInterface/INotificationRepository";

export class NotificationRepository implements INotificationRepository{
    async fetchNotification(id:string):Promise<INotification[]|null>{
        try {
            return await Notification.find({$or:[{organizerId:id},{userId:id}]}).sort({createdAt:-1})

            
        } catch (error) {
            console.log((error));
            return null
            
            
        }
    }
    async markRead(id:string):Promise<INotification|null>{
        try {
           return await Notification.findByIdAndUpdate({_id:id},{$set:{isRead:true}},{new:true})
            
        } catch (error) {
            console.log(error);
            
            return null
            
        }
        
    }
}