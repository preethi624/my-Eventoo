import { GetOrder, IOrderFilter } from "src/interface/event";
import { IAdminOrderService } from "./serviceInterface/IAdminOrderService";
import { IAdminOrderRepository } from "src/repositories/repositoryInterface/IAdminOrderRepository";
import { OrderDashboard } from "src/interface/IUser";

export class AdminOrderService implements IAdminOrderService{
    constructor(private adminOrderRepository:IAdminOrderRepository){};
    async getOrders(filters:IOrderFilter):Promise<GetOrder>{
    
    try {
      
      
        const response=await this.adminOrderRepository.getOrdersAll(filters);
      
        
    
        
        if(response){
          return {result:response,success:true,message:"Users fetched successfully"}
        }else{
          return{success:false,message:"failed to fetch users"}
        }
        
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          message: 'Internal server error',
        };
        
      }
    
    }
    async getDashboard(timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<OrderDashboard>{
    
    try {
      
      
        const response=await this.adminOrderRepository.getDashboardOrders(timeFrame,startDate,endDate,category,month,year);
      
        
    
        
        if(response){
          return {orders:response.orders,success:true,message:"Users fetched successfully",salesReport:response.salesReport,totalAdminEarning:response.totalAdminEarning}
        }else{
          return{success:false,message:"failed to fetch users"}
        }
        
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          message: 'Internal server error',
        };
        
      }
    
    }

    



}