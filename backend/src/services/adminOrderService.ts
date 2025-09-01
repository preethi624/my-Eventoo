import { GetOrder, IOrderFilter } from "src/interface/event";
import { IAdminOrderService } from "./serviceInterface/IAdminOrderService";
import { IAdminOrderRepository } from "src/repositories/repositoryInterface/IAdminOrderRepository";
import { OrderDashboard } from "src/interface/IUser";
import { MESSAGES } from "../constants/messages";
import { IOrder } from "src/model/order";
import { IOrderDTO } from "src/interface/IOrder";

export class AdminOrderService implements IAdminOrderService {
  constructor(private _adminOrderRepository: IAdminOrderRepository) {}
  async getOrders(filters: IOrderFilter): Promise<GetOrder> {
    try {
      const response = await this._adminOrderRepository.getOrdersAll(filters);

      if (response) {
        return {
          result: response,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async getDashboard(
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<OrderDashboard> {
    try {
      const response = await this._adminOrderRepository.getDashboardOrders(
        timeFrame,
        startDate,
        endDate,
        category,
        month,
        year
      );

      if (response) {
        return {
          orders: response.orders,
          success: true,
          message: "Users fetched successfully",
          salesReport: response.salesReport,
          totalAdminEarning: response.totalAdminEarning,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async orderDetailsGet(orderId:string):Promise<{success:boolean,orders?:IOrderDTO}>{
    try {
      const response=await this._adminOrderRepository.getOrderDetails(orderId);
      if(response){
        return {success:true,orders:response}

      }else{
        return{success:false}
      }
      
    } catch (error) {
      console.log(error);
      return {success:false}
      
      
    }
  }
}
