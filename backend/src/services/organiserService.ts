import { GetOrganiser, IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserService } from "./serviceInterface/IOrganiserService";
import { IOrganiserRepository } from "src/repositories/repositoryInterface/IOrganiserRepository";
import { OrgStatusCheck} from "src/interface/event";
import { EditOrganiserResult, ProfileEdit, Reapply } from "src/interface/IUser";
import { FetchOrders, GetOrder } from "src/interface/IPayment";

export class OrganiserService implements IOrganiserService{
    constructor(private organiserRepository:IOrganiserRepository){}

    async orgGetById(id:string):Promise<GetOrganiser>{
    try {
       
        
        const result:IOrganiser|null=await this.organiserRepository.getOrganiserById(id);
        if(result){
          
            
           
            
          
            
            
            
            return {result,success:true,message:"organiser fetched successfully"}
        }else {
          
            
            return { success: false, message: "No organiser found" }; 
          } 
    } catch (error) {
        console.error(error);
        return { success: false, message: "not getting event" };
        
    }
}
async statusCheck(email:{email:string}):Promise<OrgStatusCheck>{
    try {
        const result=await this.organiserRepository.statusCheck(email);
        if(result){
            return {result:result,success:true}
        }else{
            return {success:false}
        }
    } catch (error) {
        console.error(error);
        return {success:false}
        
    }
}
async organiserUpdate(data:ProfileEdit,organiserId:string):Promise<EditOrganiserResult>{
        try {
            const result=await this.organiserRepository.updateOrganiser(data,organiserId);
            
            
        if(result){
            return {result:result,success:true,message:"user updated successfully"}
        }else{
            return {success:false,message:"failed to update"}
        }
            
        } catch (error) {

           console.log(error);
            return {success:false,message:"failed to update"}  
        }
        

    }
    async bookingFetch(organiserId:string,limit:number,page:number):Promise<FetchOrders>{
        try {
            const result=await this.organiserRepository.fetchBooking(organiserId,limit,page);
           
            
            if(result){
                return {success:true,message:"orders fetched successfully",result:result.result,totalPages:result.totalPages,currentPage:result.currentPage}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
    }   
    async orderGetDetails(orderId:string):Promise<GetOrder>{
        try {
            const result=await this.organiserRepository.getOrderDetails(orderId);
           console.log("fetch result",result);
            
            if(result){
                return {success:true,message:"orders fetched successfully",order:result}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
    }  
    async reapplyOrg(organiserId:string):Promise<Reapply>{
        try {
            const result=await this.organiserRepository.orgReapply(organiserId);
           console.log("fetch result",result);
            
            if(result){
                return {success:true,message:"reapplied successfully"}
            }else{
                return {success:false,message:"failed to reapply"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to reapply" };
            
        }
    }  


}