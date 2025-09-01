import { GetOrder, IOrderFilter } from "src/interface/event";
import { IOrderDTO } from "src/interface/IOrder";
import { OrderDashboard } from "src/interface/IUser";
import { IOrder } from "src/model/order";

export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
    getDashboard(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>;
    orderDetailsGet(orderId:string):Promise<{success:boolean,orders?:IOrderDTO}>
}