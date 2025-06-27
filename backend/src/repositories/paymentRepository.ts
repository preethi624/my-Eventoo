import Order, { IOrder } from "../model/order";
import { IPaymentRepository } from "./repositoryInterface/IPaymentRepository";
import {  IPaymentDTO, OrdersGet, Update, UserProfileUpdate } from "../interface/IPayment";
import { IEventDTO } from "src/interface/IEventDTO";
import mongoose from "mongoose";
import EventModel from "../model/event";



export class PaymentRepository implements IPaymentRepository{
    async createOrder(data:IPaymentDTO):Promise<IOrder>{
      console.log('repData',data);
      
        return await Order.create(data)

    }
    async updatePaymentDetails(orderId:string,paymentId:string,signature:string,status:string):Promise<IOrder|null>{
     
      
        const updateOrder=await Order.findOneAndUpdate({razorpayOrderId:orderId},{
            razorpayPaymentId:paymentId,
            razorpaySignature:signature,
            status:status,
            bookingStatus:"confirmed"

        },{new:true})
        if(updateOrder&&updateOrder.eventId&&updateOrder.ticketCount&&updateOrder.bookingStatus==="confirmed"){
          await EventModel.findByIdAndUpdate(updateOrder.eventId,{$inc:{ticketsSold:updateOrder.ticketCount}})
        }
        return updateOrder

    }
    async getOrders(id:string,limit:number,page:number,searchTerm:string,status:string):Promise<OrdersGet>{
        
        const skip=(page-1)*limit;
        
        
      const orders=await Order.find({userId:id,eventId:{$ne:null,$exists:true}}).populate({
            path:'eventId'
        }).lean().sort({createdAt:-1});
     const filteredOrder=orders.filter(order=>{
      if(!order.eventId)return
      const event=order.eventId as unknown as IEventDTO
      const eventTitle=event.title?.toLowerCase()||''
      const orderId=order.orderId?.toLowerCase()||''
      const search=searchTerm?.toLowerCase()||''
      const matchSearch=eventTitle.includes(search)||orderId.includes(search)
      const matchStatus =!status|| status === 'all' || order.bookingStatus?.toLowerCase() === status.toLowerCase();
      return matchSearch&&matchStatus

     })
     const totalPages=Math.ceil(filteredOrder.length/limit)
       
       
        
       
       
            
            const paginatedOrders=filteredOrder.slice(skip,skip+limit);
           
            
           
            
        


    

     

const formatedOrders: IOrder[] = paginatedOrders.map(order => {
   

    return {
      ...order,
      eventDetails: order.eventId, 
      eventId: order.eventId._id,  
    };
  });


  return {
    orders:formatedOrders,
    totalPages,
    currentPage:page
  }

    }
    async getOrderById(userId:string,orderId:string):Promise<IOrder|null>{
     
      
      return await Order.findOne({userId:userId,_id:orderId}).populate({path:'eventId'});
      
      

    }
    async failurePayment(payStatus:string,orderId:string,userId:string):Promise<IOrder|null>{
      console.log("orderId",orderId);
      
      return await Order.findOneAndUpdate({userId,_id:orderId},{status:payStatus},{new:true});

    }
    async getOrdersById(userId:string):Promise<UserProfileUpdate>{
      try {
        const [stats]=await Order.aggregate([
        {$match:{ userId: new mongoose.Types.ObjectId(userId), status: 'paid' } },
        {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: {$divide:['$amount',100]} },
          eventsBooked: { $sum: 1 },
        },
      },

      ])
      return {
      success: true,
      totalSpent: stats?.totalSpent || 0,
      eventsBooked: stats?.eventsBooked || 0,
    };
        
      } catch (error) {
        console.error('Error fetching user stats:', error);
    return { success: false, message: 'Failed to fetch stats' };
        
      }
      
    }
    async findOrder(orderId:string):Promise<IOrder|null>{
      return await Order.findById({_id:orderId})
    }
    async updateRefund(refundId:string,orderId:string):Promise<Update>{
      const order=await Order.findById(orderId)
       if (!order) throw new Error('Order not found');
       const eventId=order.eventId;
       const ticketCount=order.ticketCount;

      await Order.findByIdAndUpdate(orderId,{refundId:refundId,status:"refunded",bookingStatus:"cancelled"});
      await EventModel.findByIdAndUpdate(eventId,{$inc:{availableTickets:ticketCount}})
      return {success:true}


    }
    
    

}