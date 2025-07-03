import { StatusCode } from "../constants/statusCodeEnum";
import { IAdminOrderService } from "src/services/serviceInterface/IAdminOrderService";
import { Request, Response } from "express";
import { IAdminOrderController } from "./controllerInterface/IAdminOrderController";
import { IOrderFilter } from "src/interface/event";

export class AdminOrderController implements IAdminOrderController{
    constructor(private adminOrderService:IAdminOrderService){};
    async getAllOrders(req:Request,res:Response):Promise<void>{
  try {
 const filters: IOrderFilter = {
        searchTerm: req.query.searchTerm as string,
        statusFilter: req.query.status as string,
        selectedDate: req.query.date as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
        organiser:req.query.organiser as string,
        user:req.query.user as string
      };
      
      

        
    const result=await this.adminOrderService.getOrders(filters);

    
  if(result.success){
    res.json({result:result,message:result.message,success:true})
  }else{
    res.json({message:result.message,success:false})

  } 

    
  } catch (error) {
    console.log(error);
    

     res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
  }



}
async getDashboardOrders(req:Request,res:Response):Promise<void>{
  try {
 
      
      

        
    const result=await this.adminOrderService.getDashboard();

    
  if(result.success){
    res.json({result:result.recentTransactions,message:result.message,success:true})
  }else{
    res.json({message:result.message,success:false})

  } 

    
  } catch (error) {
    console.log(error);
    

     res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
  }



}


}