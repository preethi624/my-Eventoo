export interface INotification{
userId?: string      
  organizerId?:string
  message: string;                        
  type: string
  isRead: boolean;                       
  createdAt: Date;

}
export interface FetchNotification{
    notifications?:INotification[];
    success?:boolean
}