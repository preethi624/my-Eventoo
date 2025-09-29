import { GetOrder, IOrderFilter } from "src/interface/event";
<<<<<<< HEAD
import { IOrderDTO } from "src/interface/IOrder";
import { OrderDashboard } from "src/interface/IUser";


export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
    getDashboard(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>;
    orderDetailsGet(orderId:string):Promise<{success:boolean,orders?:IOrderDTO}>
=======
import { OrderDashboard } from "src/interface/IUser";

export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
    getDashboard(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}