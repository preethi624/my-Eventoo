import { GetOrder, IOrderFilter } from "src/interface/event";

export interface IAdminOrderService{
    getOrders(filters:IOrderFilter):Promise<GetOrder>
}