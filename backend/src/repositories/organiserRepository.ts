import { IOrganiser } from "src/interface/IOrgAuth";
import { IOrganiserRepository } from "./repositoryInterface/IOrganiserRepository";
import Organiser from "../model/organiser";
import { Attendees, ProfileEdit} from "src/interface/IUser";
import { FetchOrders, Update } from "src/interface/IPayment";
import Order, { IOrder } from "../model/order";
import EventModel, { IEvent } from "../model/event";
import Venue, { IVenue } from "../model/venue";
import { OrgVenueFilter, VenueFetch } from "src/interface/IVenue";
import mongoose, { FilterQuery } from "mongoose";
import { generateSalesTrend } from "../utils/analyticHelper";
import { DashboardResponse } from "src/interface/event";
import PlatformSettings from "../model/platformSettings";
import { TicketModel } from "../model/ticket";


import { IUser } from "src/interface/IUserAuth";
import Notification from "../model/notification";
export type IEventPlain = Omit<IEvent, keyof Document>;
export interface ITopEventWithEarnings extends IEventPlain {
  totalRevenue: number;
  organiserEarning: number;
}






export class OrganiserRepository implements IOrganiserRepository {
  async getOrganiserById(id: string): Promise<IOrganiser | null> {
    return await Organiser.findById(id);
  }
  async statusCheck(emailObj: { email: string }): Promise<IOrganiser | null> {
    const { email } = emailObj;

    return await Organiser.findOne({ email });
  }
  async updateOrganiser(
    data: ProfileEdit,
    organiserId: string
  ): Promise<IOrganiser | null> {
    const { name,  phone, location, aboutMe, profileImage } = data;
    return await Organiser.findByIdAndUpdate(
      organiserId,
      { name, phone, location, aboutMe: aboutMe, profileImage },
      { new: true }
    );
  }
  async fetchBooking(
    organiserId: string,
    limit: number,
    page: number,
    searchTerm: string,
    status: string,
    date: string
  ): Promise<FetchOrders> {
    const skip = (page - 1) * limit;
    const allOrders = await Order.find()
      .populate({
        path: "eventId",
        select: "title organiser ticketPrice",
      })
      .populate({ path: "userId" })
      .sort({ createdAt: -1 });

    const filteredOrder = allOrders.filter((order) => {
      const event = order.eventId as unknown as IEvent;
      const organiserMatch =
        event && event.organiser && event.organiser.toString() === organiserId;
      const search = searchTerm?.toLowerCase() || "";
      const eventTitle = event?.title?.toLowerCase() || "";
      const orderId = order?.orderId?.toLowerCase() || "";
      const eventCategory = event?.category?.toLowerCase() || "";
      const searchMatch =
        eventTitle.includes(search) ||
        orderId.includes(search) ||
        eventCategory.includes(search);
      const statusMatch =
        !status ||
        status === "all" ||
        order.bookingStatus?.toLowerCase() === status.toLowerCase();
      let dateMatch = true;
      if (date) {
        const filterDate = new Date(date);
        const orderDate = new Date(order.createdAt);

        dateMatch =
          filterDate.getFullYear() === orderDate.getFullYear() &&
          filterDate.getMonth() === orderDate.getMonth() &&
          filterDate.getDate() === orderDate.getDate();
      }
      return organiserMatch && searchMatch && statusMatch && dateMatch;
    });
    const totalOrders = filteredOrder.length;
    const paginatedOrders = filteredOrder.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalOrders / limit);
    return {
      result: paginatedOrders,
      totalPages,
      currentPage: page,
    };
  }
  async getOrderDetails(orderId: string): Promise<IOrder | null> {
    console.log("orderId", orderId);
    const cleanOrderId = orderId.replace(/^:/, "");

    return await Order.findOne({ _id: cleanOrderId })
      .populate("eventId")
      .populate({ path: "userId" });
  }
  async orgReapply(organiserId: string): Promise<IOrganiser | null> {
    return await Organiser.findByIdAndUpdate(
      organiserId,
      { status: "pending" },
      { new: true }
    );
  }
  async getVenues(filters: OrgVenueFilter): Promise<VenueFetch> {
    const skip =
      filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;

    const query: FilterQuery<IVenue> = {};
    if (filters.searchTerm) {
     
      query.$or=[
        {name:{$regex:filters.searchTerm,$options:"i"}},
        {city:{$regex:filters.searchTerm,$options:"i"}}
      ]
    }
    
    const venues = await Venue.find(query)
      .skip(skip)
      .limit(Number(filters.limit));
    const total = await Venue.countDocuments(query);
    return {
      venues,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
      currentPage: filters.page,
    };
  }
  async getVenueById(venueId: string): Promise<IVenue | null> {
    return await Venue.findById(venueId);
  }
  async getDashboard(eventId: string): Promise<DashboardResponse> {
    const objectId = new mongoose.Types.ObjectId(eventId);

    const event = await EventModel.findById(objectId).populate("venue").lean();

    const orders = await Order.aggregate([
      { $match: { eventId: objectId} },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          orderId: 1,
          amount: 1,
          ticketCount: 1,
          status: 1,
          bookingStatus: 1,
          createdAt: 1,
          userId: {
            name: "$user.name",
            email: "$user.email",
          },
          ticketType:"$selectedTicket.type"
        },
      },
    ]);
    const ticketTypeStats=orders.reduce((acc,order)=>{
      const type=order.ticketType;
      if(type){
        if(!acc[type]){
          acc[type]={count:0,tickets:0,revenue:0}
        }
        acc[type].count+=1;
        acc[type].tickets+=order.ticketCount;
        if(order.bookingStatus==="confirmed"){
            acc[type].revenue += order.amount;


        }
        
      }
      return acc

    },{})
    console.log("ticket type stats",orders);
    

    const stats = {
      confirmed: orders.filter((o) => o.bookingStatus === "confirmed").length,
      pending: orders.filter((o) => o.bookingStatus === "pending").length,
      cancelled: orders.filter((o) => o.bookingStatus === "cancelled").length,
      salesTrend: generateSalesTrend(orders),
      ticketTypes:ticketTypeStats
    };

    return { event, orders, stats };
  }
  async fetchAttendees(
    eventId: string,
    organiserId: string,
    searchTerm: string,
    filterStatus: string,
    page: number,
    limit: number
  ): Promise<Attendees> {
   

    const settings = await PlatformSettings.findOne();
    const adminCommissionPercentage = settings?.adminCommissionPercentage ?? 10;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const matchStage: {
      eventId: mongoose.Types.ObjectId;
      bookingStatus?: string;
      createdAt?: { $gte: Date };
    } = {
      eventId: new mongoose.Types.ObjectId(eventId),
      
    };
    if (filterStatus && filterStatus !== "all") {
      matchStage.bookingStatus = filterStatus;
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },

      {
        $match: {
          "eventDetails.organiser": new mongoose.Types.ObjectId(organiserId),
          "eventDetails.status": "completed",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
    ];
 
    

    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.name": { $regex: searchTerm, $options: "i" } },
            { "userDetails.email": { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    const projectStage: mongoose.PipelineStage = {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$userDetails.name",
        email: "$userDetails.email",
        ticketCount: 1,
        createdAt: 1,
        bookingStatus: 1,
        orderId: 1,
        amount: 1,
        ticketType:"$selectedTicket.type"
      },
    };
    const ticketTypeStatsPipeline = [
  ...pipeline,
  projectStage,
  {
    $group: {
      _id: "$ticketType",
      count: { $sum: 1 },
      tickets: { $sum: "$ticketCount" },
      revenue: { $sum: "$amount" },
    }
  }
];
const ticketTypeStats = await Order.aggregate(ticketTypeStatsPipeline);

    const countRevenuePipeline = [...pipeline, projectStage];
    const allAttendees = await Order.aggregate(countRevenuePipeline);
    const totalAttendees = allAttendees.length;
    const totalRevenue = allAttendees.reduce((acc, curr) => {
      if (curr?.bookingStatus === "confirmed") {
        acc += curr.amount / 100;
      }
      return acc;
    }, 0);
    const actualRevenue = totalRevenue * (1 - adminCommissionPercentage / 100);
    const skip = (page - 1) * limit;
    /*const paginatedPipeline = [
      ...pipeline,
      projectStage,
      { $skip: skip },
      { $limit: limit },
    ];
    const attendee = await Order.aggregate(paginatedPipeline);*/
    const paginatedPipeline = [
  ...pipeline,

  // 👇 Join tickets to know check-in status
  {
    $lookup: {
      from: "tickets",
      localField: "_id", // Order _id
      foreignField: "orderId",
      as: "ticketDetails",
    },
  },
  {
    $unwind: {
      path: "$ticketDetails",
      preserveNullAndEmptyArrays: true, // In case ticket not found
    },
  },

  // 👇 Add check-in info to projection
  {
    $project: {
      _id: 0,
      id: "$_id",
      name: "$userDetails.name",
      email: "$userDetails.email",
      ticketCount: 1,
      createdAt: 1,
      bookingStatus: 1,
      orderId: 1,
      amount: 1,
      ticketType: "$selectedTicket.type",
      checkedIn: { $ifNull: ["$ticketDetails.checkedIn", false] }, // 👈 shows true/false
    },
  },
  { $skip: skip },
  { $limit: limit },
];

const attendee = await Order.aggregate(paginatedPipeline);

   
    

    return {
      attendees: attendee,
      revenue: actualRevenue,
      currentPage: page,
      totalPages: Math.ceil(totalAttendees / limit),
      totalAttendees: totalAttendees,
      ticketTypeStats
    };
  }

  async dashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<{
    events: IEvent[];
    data: {
      month: number;
      revenue: number;
      events: number;
    }[];
    adminCommissionPercentage: number;
    organiserEarning: number;
    totalEvents: number;
    totalAttendees: number;
    topEvents: IEvent[];
    upcomingEvents: IEvent[];
    orderDetails: {
      name: string;
      email: string;
      eventTitle: string;
      eventDate: Date;
      orderDate: Date;
      amount: number;
      ticketCount: number;
    }[];
  }> {
    let stDate: Date;
    let enDate: Date | undefined;

    if (startDate && endDate) {
      stDate = new Date(startDate);
      enDate = new Date(endDate);
    } else if (month || year) {
      const targetYear = parseInt(year ?? new Date().getFullYear().toString());
      const targetMonth = month ? parseInt(month) : 0;

      stDate = new Date(targetYear, targetMonth, 1);
      enDate = month
        ? new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999)
        : new Date(targetYear, 11, 31, 23, 59, 59, 999);
    } else if (timeFrame) {
      const days = timeFrame === "7d" ? 7 : timeFrame === "30d" ? 30 : 90;
      stDate = new Date();
      stDate.setDate(stDate.getDate() - days);
      enDate = new Date();
    } else {
      const targetYear = parseInt(new Date().getFullYear().toString());
      stDate = new Date(targetYear, 0, 1);
      enDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
    }

    const eventMatchCondition: Record<string, unknown> = {
      "EventDetails.organiser": new mongoose.Types.ObjectId(organiserId),
      "EventDetails.status": "completed",
      createdAt: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
    };

    if (category) {
      eventMatchCondition["EventDetails.category"] = category;
    }
    const eventQuery: Record<string, unknown> = {
      organiser: organiserId,
      date: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
    };

    if (category) {
      eventQuery.category = category;
    }

    const data = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      {
        $unwind: "$EventDetails",
      },
      { $match: eventMatchCondition },
      {
        $project: {
          month: { $month: "$createdAt" },
          revenue: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$revenue" },
          totalEvents: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: "$totalRevenue",
          events: "$totalEvents",
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    console.log("data",data);
    

    const settings = await PlatformSettings.findOne();
    const adminCommissionPercentage = settings?.adminCommissionPercentage ?? 10;
    const adjustedData = data.map((item) => ({
      month: item.month,
      events: item.events,
      revenue: item.revenue - (item.revenue * adminCommissionPercentage) / 100,
    }));

    const events = await EventModel.find(eventQuery);;

    const totalEvents = events.length;
    const topEvents = [...events]
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5);
      // Collect top event IDs


    
      const upcomingEvents = await EventModel.find({
  organiser: organiserId,
  date: { $gte: new Date() } 
})
  .sort({ date: 1 })
  .limit(5);

      console.log("upcomings",events);
      
    const earningAggregation = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      { $unwind: "$EventDetails" },
      {
        $match: eventMatchCondition,
      },
      {
        $addFields: {
          ticketPrice: { 
      $ifNull: ["$selectedTicket.price", "$EventDetails.ticketPrice"] 
    },
          quantity: "$ticketCount",
          commissionRate: adminCommissionPercentage,
        },
      },
      {
        $addFields: {
          organiserEarning: {
            $subtract: [
              { $multiply: ["$ticketPrice", "$quantity"] },
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $multiply: ["$ticketPrice", adminCommissionPercentage],
                      },
                      100,
                    ],
                  },
                  "$quantity",
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: "$organiserEarning" },
          totalAttendees: { $sum: "$ticketCount" },
        },
      },
    ]);
    const organiserEarning = earningAggregation[0]?.totalEarning ?? 0;
    const totalAttendees = earningAggregation[0]?.totalAttendees ?? 0;
    const orderDetails = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      { $unwind: "$EventDetails" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: eventMatchCondition,
      },
      {
        $project: {
          username: "$user.name",
          email: "$user.email",
          eventTitle: "$EventDetails.title",
          eventDate: "$EventDetails.date",
          orderDate: "$createdAt",

          amount: 1,
          ticketCount: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
   
    

    return {
      events,
      data: adjustedData,
      adminCommissionPercentage,
      organiserEarning,
      totalEvents,
      totalAttendees,
      topEvents,
      upcomingEvents,
      orderDetails,
    };
  }
 /*async dashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<{
    events: IEvent[];
    data: {
      month: number;
      revenue: number;
      events: number;
    }[];
    adminCommissionPercentage: number;
    organiserEarning: number;
    totalEvents: number;
    totalAttendees: number;
    topEvents: IEvent[];
    upcomingEvents: IEvent[];
    orderDetails: {
      name: string;
      email: string;
      eventTitle: string;
      eventDate: Date;
      orderDate: Date;
      amount: number;
      ticketCount: number;
    }[];
  }> {
    let stDate: Date;
    let enDate: Date | undefined;

    if (startDate && endDate) {
      stDate = new Date(startDate);
      enDate = new Date(endDate);
    } else if (month || year) {
      const targetYear = parseInt(year ?? new Date().getFullYear().toString());

      const targetMonth = month ? parseInt(month) : 0;

      stDate = new Date(targetYear, targetMonth, 1);

      if (month) {
        enDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
      } else {
        enDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
      }
    } else if (!month && !year) {
      const targetYear = parseInt(new Date().getFullYear().toString());
      stDate = new Date(targetYear, 0, 1);
      enDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
    } else {
      const days = timeFrame === "7d" ? 7 : timeFrame === "30d" ? 30 : 90;
      stDate = new Date();
      stDate.setDate(stDate.getDate() - days);
    }

    const eventMatchCondition: Record<string, unknown> = {
      "EventDetails.organiser": new mongoose.Types.ObjectId(organiserId),
      "EventDetails.status": "completed",
      createdAt: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
    };

    if (category) {
      eventMatchCondition["EventDetails.category"] = category;
    }
    const eventQuery: Record<string, unknown> = {
      organiser: organiserId,
      date: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
    };

    if (category) {
      eventQuery.category = category;
    }

    const data = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      {
        $unwind: "$EventDetails",
      },
      { $match: eventMatchCondition },
      {
        $project: {
          month: { $month: "$createdAt" },
          revenue: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$revenue" },
          totalEvents: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: "$totalRevenue",
          events: "$totalEvents",
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const settings = await PlatformSettings.findOne();
    const adminCommissionPercentage = settings?.adminCommissionPercentage ?? 10;
    const adjustedData = data.map((item) => ({
      month: item.month,
      events: item.events,
      revenue: item.revenue - (item.revenue * adminCommissionPercentage) / 100,
    }));

    const events = await EventModel.find(eventQuery);

    const totalEvents = events.length;
    const topEvents = [...events]
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5);

    const upcomingEvents = events
      .filter((event) => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
    const earningAggregation = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      { $unwind: "$EventDetails" },
      {
        $match: eventMatchCondition,
      },
      {
        $addFields: {
          ticketPrice: "$EventDetails.ticketPrice",
          quantity: "$ticketCount",
          commissionRate: adminCommissionPercentage,
        },
      },
      {
        $addFields: {
          organiserEarning: {
            $subtract: [
              { $multiply: ["$ticketPrice", "$quantity"] },
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $multiply: ["$ticketPrice", adminCommissionPercentage],
                      },
                      100,
                    ],
                  },
                  "$quantity",
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: "$organiserEarning" },
          totalAttendees: { $sum: "$ticketCount" },
        },
      },
    ]);
    const organiserEarning = earningAggregation[0]?.totalEarning ?? 0;
    const totalAttendees = earningAggregation[0]?.totalAttendees ?? 0;
    const orderDetails = await Order.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "EventDetails",
        },
      },
      { $unwind: "$EventDetails" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: eventMatchCondition,
      },
      {
        $project: {
          username: "$user.name",
          email: "$user.email",
          eventTitle: "$EventDetails.title",
          eventDate: "$EventDetails.date",
          orderDate: "$createdAt",

          amount: 1,
          ticketCount: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    console.log("organiser earning",organiserEarning);
    

    return {
      events,
      data: adjustedData,
      adminCommissionPercentage,
      organiserEarning,
      totalEvents,
      totalAttendees,
      topEvents,
      upcomingEvents,
      orderDetails,
    };
  }*/
  async updateTicket(qrToken: string): Promise<{ message: string }> {
    const ticket = await TicketModel.findOne({ qrToken: qrToken });
    if (!ticket) {
      return { message: "Invalid ticket" };
    } else if (ticket.checkedIn === true) {
      return { message: "Already checkedin" };
    }
    ticket.checkedIn = true;
    await ticket.save();
    return {
      message: "Check-in successful",
    };
  }
  async getUsers(orgId:string): Promise<IUser[]> {
    try {
    const users = await Order.aggregate([
      
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },

      {
        $match: {
          "eventDetails.organiser": new mongoose.Types.ObjectId(orgId),
        },
      },

      
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

    
      {
        $group: {
          _id: "$userDetails._id",
          name: { $first: "$userDetails.name" },
          email: { $first: "$userDetails.email" },
          phone: { $first: "$userDetails.phone" },
          bookedEvents: {
            $push: {
              eventId: "$eventDetails._id",
              title: "$eventDetails.title",
              date: "$eventDetails.date",
              venue: "$eventDetails.venue",
            },
          },
        },
      },
    ]);

    console.log("Users who booked organiser's events:", users);
    return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async fetchEventOrders(eventId:string):Promise<IOrder[]|null>{
    try {
      return await Order.find({eventId:eventId}).lean().populate("userId","name email");
      
    } catch (error) {
      console.log(error);
      return null
      
      
    }
   

  }
  async updateRefund(refundId: string, orderId: string): Promise<Update> {
      try {
        console.log("refundid", refundId);
  
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Order not found");
        const eventId = order.eventId;
        const ticketCount = order.ticketCount;
        await Order.findByIdAndUpdate(orderId, {
          refundId: refundId,
          status: "refunded",
          bookingStatus: "cancelled",
        });
  
        await EventModel.findByIdAndUpdate(eventId, {
          $inc: { availableTickets: ticketCount },
        });
         await Notification.create({
        userId: order.userId,
        message: `Your booking for event "${order.eventTitle}" refunded with amount ${order.amount/100}!Cancelled  By Organiser `,
        type: "general",
        isRead: false,
      })
        return { success: true };
      } catch (error) {
        console.log(error);
  
        return { success: false, message: "Failed to refund" };
      }
    }
    async findOrder(orderId: string): Promise<IOrder | null> {
        return await Order.findById({ _id: orderId });
      }
      async fetchVenues():Promise<IVenue[]|null>{
        try {
          const targetDate = new Date("2025-10-19");
          const venues=await Venue.find({
      createdAt: { $gte: targetDate }
    })
    console.log("Venues found:", venues.map(v => v.name)); 
    
    
    return venues
          
        } catch (error) {
          console.log(error);
          return null
          

          
        }
      }
}
