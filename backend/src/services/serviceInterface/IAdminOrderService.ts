import { GetOrder, IOrderFilter } from "src/interface/event";
import { OrderDashboard } from "src/interface/IUser";

export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
    getDashboard():Promise<OrderDashboard>
}