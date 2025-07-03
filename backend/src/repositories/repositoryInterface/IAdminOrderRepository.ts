import { IAdminOrder } from "src/interface/IAdmin";
import { OrderDashboard } from "src/interface/IUser";

export interface IAdminOrderRepository{
   
getOrdersAll(filters: {
    searchTerm?: string;
    statusFilter?: string;
    selectedDate?: string;
    page?: number;
    limit?: number;
  }):Promise<IAdminOrder>;
  getDashboardOrders():Promise<OrderDashboard>
}
 