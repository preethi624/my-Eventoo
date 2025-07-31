import { GetOrder, IOrderFilter } from "src/interface/event";
import { OrderDashboard } from "src/interface/IUser";

export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
    getDashboard(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>
}