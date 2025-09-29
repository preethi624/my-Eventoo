import { IAdminOrder } from "src/interface/IAdmin";
<<<<<<< HEAD
import { IOrderDTO } from "src/interface/IOrder";
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { OrderDashboard } from "src/interface/IUser";

export interface IAdminOrderRepository{
   
getOrdersAll(filters: {
    searchTerm?: string;
    statusFilter?: string;
    selectedDate?: string;
    page?: number;
    limit?: number;
  }):Promise<IAdminOrder>;
<<<<<<< HEAD
  getDashboardOrders(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>;
   getOrderDetails(orderId:string):Promise<IOrderDTO|null>
=======
  getDashboardOrders(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}
 