import { FetchNotification } from "src/interface/INotification";
import { INotificationService } from "./serviceInterface/INotificationService";
import { INotificationRepository } from "src/repositories/repositoryInterface/INotificationRepository";

export class NotificationService implements INotificationService{
    constructor(private _notificationRepository:INotificationRepository){}
    async notificationFetch(id:string):Promise<FetchNotification>{
        try {
            const response=await this._notificationRepository.fetchNotification(id);
            if(response){
                return {success:true,notifications:response}
            }else{
                return {success:false}
            }
            
        } catch (error) {
            console.log(error);
            return {success:false}
            
            
        }

    }
    async readMark(id:string):Promise<{success:boolean}>{
        try {
            const response=await this._notificationRepository.markRead(id);
            if(response){
                return{success:true}
            }else{
                return {success:false}
            }
            
        } catch (error) {
            console.log(error);
            return{success:false}
            
            
        }
    }
}