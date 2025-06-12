import { IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserRepository } from "./repositoryInterface/IOrganiserRepository";
import Organiser from "../model/organiser";
import { ProfileEdit } from "src/interface/IUser";
import { FetchOrders } from "src/interface/IPayment";
import Order, { IOrder } from "../model/order";
import { IEvent } from "../model/event";
import { ALL } from "dns";

export class OrganiserRepository implements IOrganiserRepository{
    async getOrganiserById(id:string):Promise<IOrganiser|null>{
      
        
        return await Organiser.findById(id)

    }
    async statusCheck(emailObj:{email:string}):Promise<IOrganiser|null>{
;
        const {email}=emailObj
        
     
        
        
        return await Organiser.findOne({email})
        


    }
    async updateOrganiser(data:ProfileEdit,organiserId:string):Promise<IOrganiser|null>{
        const {name,email,phone,location,aboutMe,profileImage}=data
        return await Organiser.findByIdAndUpdate(organiserId,
            {name,phone,location,aboutMe:aboutMe,profileImage},{new:true}


        )


    }
    async fetchBooking(organiserId:string,limit:number,page:number):Promise<FetchOrders>{
      const skip = (page - 1) * limit;
      const allOrders=await Order.find().populate({
        path:'eventId',
        select:'title organiser ticketPrice'
      });
      const filteredOrder=allOrders.filter((order)=>{
        const event = order.eventId as unknown as IEvent;
        return event&&event.organiser&&event.organiser.toString()===organiserId
      });
      const totalOrders=filteredOrder.length;
      const paginatedOrders=filteredOrder.slice(skip,skip+limit)
      const totalPages=Math.ceil(totalOrders/limit);
      return {
        result:paginatedOrders,
        totalPages,
        currentPage:page
      }


    }
    async getOrderDetails(orderId:string):Promise<IOrder|null>{
        console.log("orderId",orderId);
        const cleanOrderId = orderId.replace(/^:/, '');
        
        return await Order.findOne({_id:cleanOrderId}).populate('eventId');
      
        
    }  
    async orgReapply(organiserId:string):Promise<IOrganiser|null>{
        return await Organiser.findByIdAndUpdate(organiserId,{status:"pending"},{new:true})
    }
}