import { IEvent } from "src/model/event";

import { IUser } from "./IUserAuth";
import { IOrganiser } from "./IOrgAuth";

export interface EventGet{
    message:string;
    success:boolean;
    result?:IEvent[];
    response?:GetEvent


}
export interface EventById{

 message:string;
    success:boolean;
    result?:IEvent


}
export interface CreateEvent{
  success:boolean;
  message:string

}
export interface EventEdit  {
  id:string;
 
  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description:string;
  ticketPrice:number;
  capacity:number;
  category:string;
  time:string;

};
export interface EditEvent{
  title: string;
    description: string;
    date: string;
    time:string;
    
    venue: string;
    capacity: number;
    status: string

}
export interface EventEdit{
  message:string;
  success:boolean
}
export interface EditOrg{
  name:string;
  email:string;
  password?:string;
  phone?: string;
  status?: 'pending' | 'approved' | 'rejected';
 

}
export interface StatusCheck{
  result?:IUser;
  success:boolean;
}
export interface OrgStatusCheck{
  result?:IOrganiser;
  success:boolean;
}
export interface GetEvent{
  events:IEvent[];
  totalPages:number;
  currentPage:number;

}
export interface IEventFilter {
  searchLocation?: string;
  searchTitle?:string;
  selectedCategory?: string;
  maxPrice?: number;
  selectedDate?: string;
  page?:number;
  limit?:number
  
}
export interface EventCount{
  count?:number;
  success:boolean;

}




