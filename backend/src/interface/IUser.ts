import { IUser } from "./IUserAuth";

export interface UserGet{
    user?:IUser;
    success:boolean;
    message:string
}
export interface ProfileEdit{
  name?:string;
  email?:string;
  phone?:number;
  location?:string;
  aboutMe?:string;
  profileImage?:string;
}
export interface EditResult{
    success:boolean;
    message:string;
    result?:IUser
}
export interface EditOrganiserResult{
  success:boolean;
    message:string;
    result?:IUser

}
export interface Reapply{
  success:boolean;
  message:string;
}
export interface DashboardUsers{
  data?:{
    month:string;
    totalUsers:number;
  }[];
  success?:boolean;
  message?:string;
  totalUsers?:number

}
export interface OrderDashboard{
  orders?:{
    date?:Date;
  id?:string;
  user?:string;
  event?:string;
  amount?:number;
  eventStatus?:string;
  status?:string;
  organiserName?:string;
  organiserEmail?:string;
  eventDate?:Date;

  }[];
  success?:boolean;
  message?:string;
  salesReport?:{
    event: string;
    eventDate: Date;
    revenue: number,
    ticketPrice: number,
    user: string,
    organiserName:string,
    organiserEmail: string,
  
    adminEarning:number

  }[];
  totalAdminEarning?:number

}
export interface Attendees{
  attendees?:{ id: string; 
      name: string;
      email: string;
      ticketCount: number;
      
      createdAt: Date;
      bookingStatus: string;
      orderId: string;
      amount: number}[];
      success?:boolean;
      message?:string;
      revenue?:number;
      currentPage?:number;
      totalPages?:number;
      totalAttendees?:number
}
export interface GetUser{
  users:IUser[];
  total?:number
}
