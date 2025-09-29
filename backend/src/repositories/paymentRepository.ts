import Order, { IOrder } from "../model/order";
import { IPaymentRepository } from "./repositoryInterface/IPaymentRepository";
import {
  IPaymentDTO,
  OrderFree,
  OrdersGet,
  Update,
  UserProfileUpdate,
} from "../interface/IPayment";
import { IEventDTO } from "src/interface/IEventDTO";
import mongoose from "mongoose";
import EventModel from "../model/event";
import { v4 as uuidv4 } from "uuid";
import { ITicket, TicketModel } from "../model/ticket";

import { PipelineStage } from "mongoose";
<<<<<<< HEAD
import Notification from "../model/notification";
import { ITicketDetails } from "src/interface/ITicket";

export class PaymentRepository implements IPaymentRepository {
  /*async createOrder(data: IPaymentDTO): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedEvent = await EventModel.findOneAndUpdate(
        { _id: data.eventId, availableTickets: { $gte: data.ticketCount } },
        //{ $inc: { availableTickets: -data.ticketCount } },
        {$inc: { "selectedTicket.capacity": -data.ticketCount }},
        { new: true, session }
      );
      if (!updatedEvent) {
        throw new Error("Not enough tickets available");
      }
      const lastOrder = await Order.findOne()
        .sort({ bookingNumber: -1 })
        .session(session);
      let nextBookingNumber = "BK-1000";
      if (lastOrder?.bookingNumber) {
        const lastNumber = parseInt(
          lastOrder.bookingNumber.replace("BK-", ""),
          10
        );
        nextBookingNumber = `BK-${lastNumber + 1}`;
      }
      const orderData = {
        ...data,
        bookingNumber: nextBookingNumber,
      };
      const [order] = await Order.create([orderData], { session });
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }*/
 async createOrder(data: IPaymentDTO): Promise<IOrder> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    
    const updatedEvent = await EventModel.findOneAndUpdate(
      {
        _id: data.eventId,
        "ticketTypes.type": data.selectedTicket?.type, 
        "ticketTypes.capacity": { $gte: data.ticketCount },
      },
      {
        $inc: {
            ticketsSold: data.ticketCount,
          "ticketTypes.$[elem].sold": data.ticketCount,
          availableTickets: -data.ticketCount, 
        },
      },
      {
        new: true,
        session,
        arrayFilters: [{ "elem.type": data.selectedTicket?.type }],
      }
    );

    if (!updatedEvent) {
      throw new Error("Not enough tickets available for the selected type");
    }

    
    const lastOrder = await Order.findOne()
      .sort({ bookingNumber: -1 })
      .session(session);

    let nextBookingNumber = "BK-1000";
    if (lastOrder?.bookingNumber) {
      const lastNumber = parseInt(
        lastOrder.bookingNumber.replace("BK-", ""),
        10
      );
      nextBookingNumber = `BK-${lastNumber + 1}`;
    }

    const orderData = {
      ...data,
      bookingNumber: nextBookingNumber,
    };

    const [order] = await Order.create([orderData], { session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

=======

export class PaymentRepository implements IPaymentRepository {
 async createOrder(data: IPaymentDTO): Promise<IOrder> {


    /*console.log("repData", data);

   
       return await Order.create(data);*/
       const session=await mongoose.startSession();
       session.startTransaction()
       try {
        const updatedEvent=await EventModel.findOneAndUpdate({ _id: data.eventId, availableTickets: { $gte: data.ticketCount } },
      { $inc: { availableTickets: -data.ticketCount } },
      { new: true, session })
      if(!updatedEvent){
        throw new Error("Not enough tickets available")
      }
      const [order]=await Order.create([data],{session})
      await session.commitTransaction();
      return order
        
       } catch (error) {
        await session.abortTransaction();
    throw error;
        
       } finally {
    session.endSession();
  }

  


   
  }
  /*async createOrder(data: IPaymentDTO): Promise<IOrder> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Reserve tickets
    const updatedEvent = await EventModel.findOneAndUpdate(
      { _id: data.eventId, availableTickets: { $gte: data.ticketCount } },
      { $inc: { availableTickets: -data.ticketCount } },
      { new: true, session }
    );

    if (!updatedEvent) {

      throw new Error("Not enough tickets available");
    }

    // Create pending order
    const order = await Order.create(
      [{ ...data, bookingStatus: "pending" }],
      { session }
    );

    await session.commitTransaction();
    return order[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}*/
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  async createOrderFree(data: OrderFree): Promise<IOrder> {
    return await Order.create(data);
  }

<<<<<<< HEAD
  async updatePaymentDetails(
=======
  /*async updatePaymentDetails(
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    orderId: string,
    paymentId: string,
    signature: string,
    status: string
<<<<<<< HEAD
  ): Promise<IOrder | null> {
    const updateOrder = await Order.findOneAndUpdate(
=======
   ): Promise<IOrder | null> {
    const session=await mongoose.startSession();
    session.startTransaction();
    try {
    
     const updateOrder = await Order.findOneAndUpdate(
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: status,
        bookingStatus: "confirmed",
      },
<<<<<<< HEAD
      { new: true }
=======
      { new: true ,session}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    );

    if (
      updateOrder &&
      updateOrder.eventId &&
      updateOrder.ticketCount &&
      updateOrder.bookingStatus === "confirmed"
    ) {
<<<<<<< HEAD
      await EventModel.findByIdAndUpdate(updateOrder.eventId._id, {
        $inc: { ticketsSold: updateOrder.ticketCount },
      });
=======
      const updatedEvent=await EventModel.findByIdAndUpdate(updateOrder.eventId._id, {
        $inc: { ticketsSold: updateOrder.ticketCount },
       
      },{new:true,session});
       if (!updatedEvent) {
      throw new Error("Not enough tickets available");
    }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      const ticketsToInsert = [];
      for (let i = 0; i < updateOrder.ticketCount; i++) {
        ticketsToInsert.push({
          userId: updateOrder.userId,
          orderId: updateOrder._id,
          eventId: updateOrder.eventId,
          qrToken: uuidv4(),
          issuedAt: new Date(),
          checkedIn: false,
        });
      }
<<<<<<< HEAD
      await TicketModel.insertMany(ticketsToInsert);
      await Notification.create({
        userId: updateOrder.userId,
        message: `Your booking for event "${updateOrder.eventTitle}" has been confirmed! 🎉`,
        type: "booking_confirmed",
        isRead: false,
      });
    }

    return Order.findById(updateOrder?._id).populate("eventId").exec();
  }
=======
      await TicketModel.insertMany(ticketsToInsert,{session});
    }
    await session.commitTransaction();
    return Order.findById(updateOrder?._id).populate("eventId").exec(); 
    
      
    } catch (error) {
      await session.abortTransaction();
      throw error
      
    }finally{
      session.endSession()
    }
    
  }*/
 /*async updatePaymentDetails(
  orderId: string,
  paymentId: string,
  signature: string,
  status: string
): Promise<IOrder | null> {
  const session=await mongoose.startSession()

  try {
    session.startTransaction()
    // Step 1: Update the order and confirm booking
    const updateOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: status,
        bookingStatus: "confirmed",
      },
      { new: true,session }
    );

    if (
      updateOrder &&
      updateOrder.eventId &&
      updateOrder.ticketCount &&
      updateOrder.bookingStatus === "confirmed"
    ) {
      // Step 2: Atomically decrement availableTickets and increment ticketsSold
      const updatedEvent = await EventModel.findOneAndUpdate(
        {
          _id: updateOrder.eventId._id,
          availableTickets: { $gte: updateOrder.ticketCount } // Ensure enough tickets left
        },
        {
          $inc: {
            ticketsSold: updateOrder.ticketCount,
            availableTickets: -updateOrder.ticketCount
          }
        },
        { new: true,session}
      );

      if (!updatedEvent) {
        throw new Error("Not enough tickets available");
      }

      // Step 3: Create ticket documents
      const ticketsToInsert = [];
      for (let i = 0; i < updateOrder.ticketCount; i++) {
        ticketsToInsert.push({
          userId: updateOrder.userId,
          orderId: updateOrder._id,
          eventId: updateOrder.eventId,
          qrToken: uuidv4(),
          issuedAt: new Date(),
          checkedIn: false,
        });
      }
      await TicketModel.insertMany(ticketsToInsert,{session});
    }
    await session.commitTransaction();
    session.endSession()

    

    // Step 5: Return populated order
    return Order.findById(updateOrder?._id).populate("eventId").exec();
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession()
    console.log(error);
    
    
    throw error;
  } 
} */
/*async updatePaymentDetails(
  orderId: string,
  paymentId: string,
  signature: string,
  status: string
): Promise<IOrder | null> {
  const session=await mongoose.startSession()
  try {
    session.startTransaction();
    const order=await Order.findOne(
      { razorpayOrderId: orderId, bookingStatus: { $ne: "confirmed" } },
      null,
      {session}
    )
     if (!order) {
      throw new Error("Order not found or already confirmed");
    }
    const updatedEvent = await EventModel.findOneAndUpdate(
      {
        _id: order.eventId._id,
        availableTickets: { $gte: order.ticketCount }, 
      },
      {
        $inc: {
          ticketsSold: order.ticketCount,
          availableTickets: -order.ticketCount,
        },
      },
      { new: true, session }
    );
    if (!updatedEvent) {
      throw new Error("Not enough tickets available");
    }
    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;
    order.status = status;
    order.bookingStatus = "confirmed";
    await order.save({ session });
    const ticketsToInsert = [];
    for (let i = 0; i < order.ticketCount; i++) {
      ticketsToInsert.push({
        userId: order.userId,
        orderId: order._id,
        eventId: order.eventId,
        qrToken: uuidv4(),
        issuedAt: new Date(),
        checkedIn: false,
      });
    }
    await TicketModel.insertMany(ticketsToInsert, { session });

    await session.commitTransaction();
    session.endSession();

    return Order.findById(order._id).populate("eventId").exec();

    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw error;
    
  }
}*/
 async updatePaymentDetails(orderId:string,paymentId:string,signature:string,status:string):Promise<IOrder|null>{
     
      
        const updateOrder=await Order.findOneAndUpdate({razorpayOrderId:orderId},{
            razorpayPaymentId:paymentId,
            razorpaySignature:signature,
            status:status,
            bookingStatus:"confirmed"

        },{new:true})

        if(updateOrder&&updateOrder.eventId&&updateOrder.ticketCount&&updateOrder.bookingStatus==="confirmed"){
          await EventModel.findByIdAndUpdate(updateOrder.eventId._id,{$inc:{ticketsSold:updateOrder.ticketCount}})
          const ticketsToInsert = [];
          for(let i=0;i<updateOrder.ticketCount;i++){
            ticketsToInsert.push({
        userId: updateOrder.userId,
        orderId: updateOrder._id,
        eventId: updateOrder.eventId,
        qrToken: uuidv4(),
        issuedAt: new Date(),
        checkedIn: false
      });

          }
          await TicketModel.insertMany(ticketsToInsert)
        }
        return Order.findById(updateOrder?._id).populate("eventId").exec()

    }

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  async getOrders(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    status: string
  ): Promise<OrdersGet> {
    const skip = (page - 1) * limit;

    const orders = await Order.find({
      userId: id,
      eventId: { $ne: null, $exists: true },
    })
      .populate({
        path: "eventId",
      })
      .lean()
      .sort({ createdAt: -1 });
    const filteredOrder = orders.filter((order) => {
      if (!order.eventId) return;
      const event = order.eventId as unknown as IEventDTO;
      const eventTitle = event.title?.toLowerCase() || "";
      const orderId = order.orderId?.toLowerCase() || "";
      const search = searchTerm?.toLowerCase() || "";
      const matchSearch =
        eventTitle.includes(search) || orderId.includes(search);
      const matchStatus =
        !status ||
        status === "all" ||
        order.bookingStatus?.toLowerCase() === status.toLowerCase();
      return matchSearch && matchStatus;
    });
    const totalPages = Math.ceil(filteredOrder.length / limit);

    const paginatedOrders = filteredOrder.slice(skip, skip + limit);

    const formatedOrders: IOrder[] = paginatedOrders.map((order) => {
      return {
        ...order,
        eventDetails: order.eventId,
        eventId: order.eventId._id,
      };
    });

    return {
      orders: formatedOrders,
      totalPages,
      currentPage: page,
    };
  }
  async getOrderById(userId: string, orderId: string): Promise<IOrder | null> {
    return await Order.findOne({ userId: userId, _id: orderId }).populate({
      path: "eventId",
    });
  }
  async failurePayment(
    payStatus: string,
    orderId: string,
    userId: string
  ): Promise<IOrder | null> {
<<<<<<< HEAD
    try {
      const order = await Order.findOneAndUpdate(
        { userId, _id: orderId },
        { status: payStatus },
        { new: true }
      );

      if (order && order.eventId) {
        await EventModel.findByIdAndUpdate(order.eventId, {
          $inc: { availableTickets: order.ticketCount },
        });
      }
      if (!order) throw new Error("order not found");
      await Notification.create({
        userId: userId,
        message: `Your booking for event "${order.eventTitle}" failed! `,
        type: "booking_cancelled",
        isRead: false,
      });

      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
 

=======
    console.log("orderId", orderId);

   /* return await Order.findOneAndUpdate(
      { userId, _id: orderId },
      { status: payStatus },
      { new: true }
    );*/
    const order = await Order.findOneAndUpdate(
    { userId, _id: orderId },
    { status: payStatus },
    { new: true }
  );

  if (order && order.eventId) {
    // Increment the available tickets in the event
    await EventModel.findByIdAndUpdate(order.eventId, {
      $inc: { availableTickets: order.ticketCount }
    });
  }

  return order;
  }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  async getOrdersById(userId: string): Promise<UserProfileUpdate> {
    try {
      const [stats] = await Order.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "paid",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalSpent: { $sum: { $divide: ["$amount", 100] } },
            eventsBooked: { $sum: 1 },
          },
        },
      ]);
      return {
        success: true,
        totalSpent: stats?.totalSpent || 0,
        eventsBooked: stats?.eventsBooked || 0,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return { success: false, message: "Failed to fetch stats" };
    }
  }
  async findOrder(orderId: string): Promise<IOrder | null> {
    return await Order.findById({ _id: orderId });
  }
  async updateRefund(refundId: string, orderId: string): Promise<Update> {
    try {
      console.log("refundid", refundId);

      const order = await Order.findById(orderId);
      if (!order) throw new Error("Order not found");
      const eventId = order.eventId;
<<<<<<< HEAD
    
=======
      const ticketCount = order.ticketCount;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      await Order.findByIdAndUpdate(orderId, {
        refundId: refundId,
        status: "refunded",
        bookingStatus: "cancelled",
      });

<<<<<<< HEAD
    
      await EventModel.findOneAndUpdate(
      {
        _id:eventId,
        "ticketTypes.type": order.selectedTicket?.type, 
        
      },
      {
        $inc: {
            ticketsSold: -order.ticketCount,
          "ticketTypes.$[elem].sold": -order.ticketCount,
          
          availableTickets: order.ticketCount, 
        },
      },
      {
        new: true,
       
        arrayFilters: [{ "elem.type": order.selectedTicket?.type }],
      }
    );
      await Notification.create({
        userId: order.userId,
        message: `Your booking for event "${
          order.eventTitle
        }" refunded with amount ${order.amount / 100}! `,
        type: "general",
        isRead: false,
=======
      await EventModel.findByIdAndUpdate(eventId, {
        $inc: { availableTickets: ticketCount },
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      });
      return { success: true };
    } catch (error) {
      console.log(error);

      return { success: false, message: "Failed to refund" };
    }
  }
  async getTickets(orderId: string): Promise<ITicket[]> {
    const tickets = await TicketModel.find({ orderId: orderId })
      .populate("eventId")
      .exec();
    return tickets as unknown as ITicket[];
  }

  async getTicketDetails(
    userId: string,
    searchTerm = "",
<<<<<<< HEAD
    status = "",
    page: string,
    limit: string
  ): Promise<ITicketDetails> {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * limitNumber;

=======
    status = ""
  ): Promise<ITicket[]> {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    const matchStage: PipelineStage.Match = {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    };
<<<<<<< HEAD

    // Base pipeline (without pagination)
    const basePipeline: PipelineStage[] = [
=======
    const pipeline: PipelineStage[] = [
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      matchStage,
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $addFields: {
          normalizedTitle: {
            $replaceAll: {
              input: { $toLower: "$event.title" },
              find: " ",
              replacement: "",
            },
          },
          normalizedVenue: {
            $replaceAll: {
              input: { $toLower: "$event.venue" },
              find: " ",
              replacement: "",
            },
          },
        },
      },
<<<<<<< HEAD
=======

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
    ];
<<<<<<< HEAD

    // search filter
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    if (searchTerm.trim() !== "") {
      const cleanedSearch = searchTerm
        .trim()
        .replace(/\s/g, "")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .toLowerCase();
      const regex = new RegExp(cleanedSearch, "i");
<<<<<<< HEAD
      basePipeline.push({
=======
      pipeline.push({
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        $match: {
          $or: [{ normalizedTitle: regex }, { normalizedVenue: regex }],
        },
      });
    }
<<<<<<< HEAD

    // status filter
    const now = new Date();
    if (status === "upcoming") {
      basePipeline.push({ $match: { "event.date": { $gte: now } } });
    } else if (status === "past") {
      basePipeline.push({ $match: { "event.date": { $lt: now } } });
    }

    // ✅ Count documents before skip/limit
    const countPipeline = [...basePipeline, { $count: "total" }];
    const countResult = await TicketModel.aggregate(countPipeline);
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limitNumber);

    // ✅ Get paginated tickets
    const dataPipeline = [
      ...basePipeline,
      {
        $project: {
          _id: 1,
          userId: 1,
          qrToken: 1,
          issuedAt: 1,
          checkedIn: 1,
          orderId: "$order._id",
          eventId: "$event._id",
          event: {
            _id: "$event._id",
            title: "$event.title",
            description: "$event.description",
            date: "$event.date",
            time: "$event.time",
            venue: "$event.venue",
            image: "$event.images",
            category: "$event.category",
          },
          order: {
            _id: "$order._id",
            totalAmount: "$order.amount",
            status: "$order.status",
          },
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ];

    const tickets = await TicketModel.aggregate(dataPipeline);

    return {
      tickets,
      totalPages,
      totalItems,
      currentPage: pageNumber,
    };
=======
    const now = new Date();
    if (status === "upcoming") {
      pipeline.push({ $match: { "event.date": { $gte: now } } });
    } else if (status === "past") {
      pipeline.push({ $match: { "event.date": { $lt: now } } });
    }
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        qrToken: 1,
        issuedAt: 1,
        checkedIn: 1,
        orderId: "$order._id",
        eventId: "$event._id",
        event: {
          _id: "$event._id",
          title: "$event.title",
          description: "$event.description",
          date: "$event.date",
          time: "$event.time",
          venue: "$event.venue",
          image: "$event.images",
          category: "$event.category",
        },
        order: {
          _id: "$order._id",
          totalAmount: "$order.amount",
          status: "$order.status",
        },
      },
    });

    const tickets = await TicketModel.aggregate(pipeline);

    return tickets;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  }
}
