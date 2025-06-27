import { GetOrder, IOrderFilter } from "src/interface/event";
import { IAdminOrderService } from "./serviceInterface/IAdminOrderService";
import { IAdminOrderRepository } from "src/repositories/repositoryInterface/IAdminOrderRepository";

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
    



}