import { IEvent } from "src/model/event";
import { IOrder } from "src/model/order";

export interface IAdmin {
    _id:string;
  name: string;
  email: string;
  password: string;
  role?: string;
}
export interface IAdminOrder{
  orders?:IOrder[];
  currentPage:number;
  totalPages:number;
}
export interface AdminDashboard{
 monthlyRevenue?: {
    month: number;
    revenue: number;
    events: number;
  }[];
  message?:string;
  success?:boolean;
  topEvents?:{
    title:string;
    ticketsSold:number;
    revenue:number
  }[];
}
