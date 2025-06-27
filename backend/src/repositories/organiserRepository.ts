import { IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserRepository } from "./repositoryInterface/IOrganiserRepository";
import Organiser from "../model/organiser";
import { ProfileEdit } from "src/interface/IUser";
import { FetchOrders } from "src/interface/IPayment";
import Order, { IOrder } from "../model/order";
import EventModel, { IEvent } from "../model/event";
import Venue, { IVenue } from "../model/venue";
import { OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import mongoose, { FilterQuery } from "mongoose";
import { generateSalesTrend } from "../utils/analyticHelper";
import { DashboardResponse } from "src/interface/event";


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
    async fetchBooking(organiserId:string,limit:number,page:number,searchTerm:string,status:string,date:string):Promise<FetchOrders>{
      const skip = (page - 1) * limit;
      const allOrders=await Order.find().populate({
        path:'eventId',
        select:'title organiser ticketPrice'
      }).populate({path:"userId"}).sort({createdAt:-1});
    
      
      const filteredOrder=allOrders.filter((order)=>{
        const event = order.eventId as unknown as IEvent;
        const organiserMatch= event&&event.organiser&&event.organiser.toString()===organiserId;
        const search = searchTerm?.toLowerCase() || '';
  const eventTitle = event?.title?.toLowerCase() || '';
  const orderId = order?.orderId?.toLowerCase() || '';
  const eventCategory=event?.category?.toLowerCase()||'';
  const searchMatch = eventTitle.includes(search) || orderId.includes(search)||eventCategory.includes(search);
  const statusMatch = !status || status === 'all' || order.bookingStatus?.toLowerCase() === status.toLowerCase();
  let dateMatch = true;
  if (date) {
    const filterDate = new Date(date); 
    const orderDate = new Date(order.createdAt);

   
    dateMatch =
      filterDate.getFullYear() === orderDate.getFullYear() &&
      filterDate.getMonth() === orderDate.getMonth() &&
      filterDate.getDate() === orderDate.getDate();
  }
  return organiserMatch && searchMatch && statusMatch&&dateMatch;

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
        
        return await Order.findOne({_id:cleanOrderId}).populate('eventId').populate({path:"userId"});
      
        
    }  
    async orgReapply(organiserId:string):Promise<IOrganiser|null>{
        return await Organiser.findByIdAndUpdate(organiserId,{status:"pending"},{new:true})
    }
    async getVenues(filters:OrgVenueFilter):Promise<VenueFetch>{

  const skip = filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;
  
  const query:FilterQuery<IVenue>={};
  if(filters.nameSearch){
    query.name={$regex:filters.nameSearch,$options:'i'};
  }
   if(filters.locationSearch){
    query.city={$regex:filters.locationSearch,$options:'i'};
  }
  const venues=await Venue.find(query).skip(skip).limit(Number(filters.limit));
  const total=await Venue.countDocuments(query)
      return {venues,totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
    currentPage: filters.page,}

    }
    async getVenueById(venueId:string):Promise<IVenue|null>{
      return await Venue.findById(venueId)

    }
    async getDashboard(eventId: string):Promise<DashboardResponse> {
  const objectId = new mongoose.Types.ObjectId(eventId);

  
  const event = await EventModel.findById(objectId).lean();

 
  const orders = await Order.aggregate([
    { $match: { eventId: objectId } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        orderId: 1,
        amount: 1,
        ticketCount: 1,
        status: 1,
        bookingStatus: 1,
        createdAt: 1,
        userId: {
          name: '$user.name',
          email: '$user.email'
        },
        
      }
    }
  ]);

  
  const stats = {
    confirmed: orders.filter(o => o.bookingStatus === 'confirmed').length,
    pending: orders.filter(o => o.bookingStatus === 'pending').length,
    cancelled: orders.filter(o => o.bookingStatus === 'cancelled').length,
    salesTrend: generateSalesTrend(orders)
  };

  return { event, orders, stats };
}

}