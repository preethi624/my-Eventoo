import { Types } from "mongoose";
export interface INotification{
userId?: string |Types.ObjectId;     
  organizerId?:string| Types.ObjectId;
  message: string;                        
  type: string
  isRead: boolean;                       
  createdAt: Date;

}
export interface FetchNotification{
    notifications?:INotification[];
    success?:boolean
}