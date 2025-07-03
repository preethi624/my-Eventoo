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
   eventCategories?:{
    value:number;
    name:string;
    color:string;
  }[];
  totalRevenue?:number;
  activeEvents?:number

}
