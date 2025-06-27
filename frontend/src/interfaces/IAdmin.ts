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
