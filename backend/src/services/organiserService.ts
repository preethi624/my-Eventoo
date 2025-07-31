import { GetOrganiser, IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserService } from "./serviceInterface/IOrganiserService";
import { IOrganiserRepository } from "src/repositories/repositoryInterface/IOrganiserRepository";
import { DashboardEvents, DashboardServiceResponse, OrgStatusCheck} from "src/interface/event";
import { Attendees, EditOrganiserResult, ProfileEdit, Reapply } from "src/interface/IUser";
import { FetchOrders, GetOrder } from "src/interface/IPayment";
import {  GetVenue,  OrgVenueFilter, VenueFetch } from "src/interface/IVenue";

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
    async bookingFetch(organiserId:string,limit:number,page:number,searchTerm:string,status:string,date:string):Promise<FetchOrders>{
        try {
            const result=await this.organiserRepository.fetchBooking(organiserId,limit,page,searchTerm,status,date);
         
            
           
            
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
      async venuesGet(filters:OrgVenueFilter):Promise<VenueFetch>{
        try {
            const result=await this.organiserRepository.getVenues(filters);
       
            
            if(result){
                return {success:true,message:"venues fetched successfully",venues:result.venues,totalPages:result.totalPages,currentPage:result.currentPage}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch orders" };
            
        }
    }  
    async venueGetById(venueId:string):Promise<GetVenue>{
        try {
            const result=await this.organiserRepository.getVenueById(venueId);
           
            
            if(result){
                return {success:true,message:"orders fetched successfully",venue:result}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch venue" };
            
        }
    }  

    async dashboardGet(eventId:string):Promise<DashboardServiceResponse>{
        try {
            const result=await this.organiserRepository.getDashboard(eventId);
           
            
            if(result){
                return {success:true,message:"orders fetched successfully",data:result}
            }else{
                return {success:false,message:"failed to fetch"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch venue" };
            
        }
    }  
    async attendeesFetch(eventId:string,organiserId:string,filters:string,filterStatus:string,page:number,limit:number):Promise<Attendees>{
        try {
            const response=await this.organiserRepository.fetchAttendees(eventId,organiserId,filters,filterStatus,page,limit);
            if(response){
                return{success:true,message:"fetched successfully",attendees:response.attendees,revenue:response.revenue,currentPage:response.currentPage,totalPages:response.totalPages,totalAttendees:response.totalAttendees}
            }else{
                return{success:false,message:"failed"}
            }
            
        } catch (error) {
              console.error(error);
        return { success: false, message: "failed to fetch attendees" }
            
        }


    }
    async getDashboardEvents(organiserId:string,timeFrame:'7d' | '30d' | '90d',startDate?:string,endDate?:string,category?:string,month?:string,year?:string):Promise<DashboardEvents>{
        try {
            console.log("serviceStart",startDate);
            
            const response=await this.organiserRepository.dashboardEvents(organiserId,timeFrame,startDate,endDate,category,month,year);
            if(response){
                return {success:true,events:response.events,message:"event fetched successfully",data:response.data,adminPercentage:response.adminCommissionPercentage,organiserEarning:response.organiserEarning,totalEvents:response.totalEvents,totalAttendees:response.totalAttendees,topEvents:response.topEvents,upcomingEvents:response.upcomingEvents,orderDetails:response.orderDetails}
            }else{
                return {success:false,message:"failed to fetch events"}
            }
            
        } catch (error) {
             console.error(error);
            return { success: false ,message:"failed"};
            
        }
    }
    async ticketUpdate(qrToken:string):Promise<{message:string}>{
        try {
            const response=await this.organiserRepository.updateTicket(qrToken);
            return {message:response.message}
            
        } catch (error) {
            console.log(error);
            return{message:"failed"}
            
            
        }
    }


}