import { IAdminOrder } from "src/interface/IAdmin";

export interface IAdminOrderRepository{
   
getOrdersAll(filters: {
    searchTerm?: string;
    statusFilter?: string;
    selectedDate?: string;
    page?: number;
    limit?: number;
  }):Promise<IAdminOrder>;
}