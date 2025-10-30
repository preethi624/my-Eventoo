import { IEventDTO, IEventImage } from "src/interface/IEventDTO";
import EventModel, { IEvent } from "../model/event";
import { IEventRepository } from "./repositoryInterface/IEventRepository";
import mongoose, { DeleteResult, FilterQuery } from "mongoose";
import { EventEdit, GetEvent, IEventFilter, Location } from "src/interface/event";
import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { BaseRepository } from "./baseRepository";
import PlatformSettings from "../model/platformSettings";

import dotenv from 'dotenv';
dotenv.config()

import Order from "../model/order";
import { Recommend } from "src/interface/IUser";
import Notification from "../model/notification";
import { IOrderDTO } from "src/interface/IOrder";
import Organiser from "../model/organiser";
import { IOrganiser } from "src/interface/IOrgAuth";







export class EventRepository
  extends BaseRepository<IEvent>
  implements IEventRepository
{
  constructor() {
    super(EventModel);
  }
  async getEvents(filters: IEventFilter): Promise<GetEvent | null> {
    

    const {
      selectedVenue,
      selectedCategory,
      maxPrice,
      selectedDate,
      searchTerm,
      page = 1,
      limit = 6,
    
    } = filters;
    console.log("selected venue",selectedVenue);
    
    
    

    const skip = (page - 1) * limit;

    const query: FilterQuery<IEvent> = {
      isBlocked: false,
      status:"published"
      
    };

    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { venue: { $regex: searchTerm, $options: "i" } },
      ];
    }
    if (selectedCategory) {
      query.category = { $regex: selectedCategory, $options: "i" };
    }
    if (selectedVenue) {
      query.venue = { $regex: selectedVenue, $options: "i" };
    }
   

    
    if (maxPrice != undefined && maxPrice != null) {
      query.ticketPrice = { $lte: maxPrice };
    }
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.date = { $gte: date, $lt: nextDay };
    }
    const totalCount = await EventModel.countDocuments(query);
    const events = await EventModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    console.log("eventsee", events);

    return {
      totalPages: Math.ceil(totalCount / limit),
      events,
      currentPage: page,
    };
  }
  async getCompleted(filters: IEventFilter): Promise<GetEvent | null> {
    

    const {
      selectedCategory,
      maxPrice,
      selectedDate,
      searchTerm,
      page = 1,
      limit = 6,
    } = filters;

    const skip = (page - 1) * limit;

    const query: FilterQuery<IEvent> = {
      isBlocked: false,
      status:"completed"
      
    };

    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { venue: { $regex: searchTerm, $options: "i" } },
      ];
    }
    if (selectedCategory) {
      query.category = { $regex: selectedCategory, $options: "i" };
    }
    if (maxPrice != undefined && maxPrice != null) {
      query.ticketPrice = { $lte: maxPrice };
    }
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.date = { $gte: date, $lt: nextDay };
    }
    const totalCount = await EventModel.countDocuments(query);
    const events = await EventModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    console.log("eventsee", events);

    return {
      totalPages: Math.ceil(totalCount / limit),
      events,
      currentPage: page,
    };
  }
  async getEventById(id: string): Promise<IEvent | null> {
    return await this.findById(id);
  }
  async createEvent(data: IEventDTO): Promise<IEvent> {
    console.log("data",data);
    

    
    const event= await EventModel.create(data);
    await Notification.create({
      organizerId:event.organiser,
      type:"event_created",
      message:`Your event ${event.title} has been created successfully!`,
      isRead:false


    })
    return event
  }
  async eventDelete(id: string): Promise<DeleteResult> {
    return this.deleteById(id);
  }
  async editEvent(id: string, data: EventEdit): Promise<IEvent | null> {
    let ticketTypes: IEvent["ticketTypes"] | undefined;

  if (data.ticketTypes) {
    ticketTypes = data.ticketTypes.map((t) => ({
      type: t.type,
      price: t.price,
      capacity: t.capacity,
      sold: t.sold ?? 0, // ensure sold is always defined
    }));
  }
    const updatedData:Partial<IEvent>= {
      ...data,
      date: new Date(data.date),
      status: data.status as "draft" | "published" | "completed" | "cancelled",
      ticketTypes
    };
    if (data.capacity !== undefined) {
      updatedData.availableTickets = data.capacity;
    }
    return this.updateById(id, updatedData);
  }
  async statusCheck(emailObj: { email: string }): Promise<IUser | null> {
    const { email } = emailObj;

    return await User.findOne({ email });
  }
  async decrementAvailableTickets(
    eventId: string,
    ticketCount: number
  ): Promise<void> {
    await EventModel.findByIdAndUpdate(eventId, {
      $inc: { availableTickets: -ticketCount },
    });
  }
  async eventGet(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    date: string,
    status:string

  ): Promise<GetEvent | null> {
    const skip = (page - 1) * limit;
    
      const filter: FilterQuery<IEvent> = { organiser: id };
    if (searchTerm) {
filter.$or = [
    { title: { $regex: searchTerm, $options: "i" } },
    { venue: { $regex: searchTerm, $options: "i" } }
  ];
     
    }
    if(status&&status!="all"){
      filter.status={$regex:status,$options:"i"}
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(date);
      nextDate.setDate(selectedDate.getDate() + 1);

      filter.date = { $gte: selectedDate, $lt: nextDate };
    }
    const events = await EventModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalEvents = await EventModel.countDocuments(filter);
    
    return {
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    };
  }
  async getEventCount(organiserId: string): Promise<number | null> {
    return await EventModel.countDocuments({ organiser: organiserId });
  }
  async dashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d"
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
  }> {
    const days = timeFrame === "7d" ? 7 : timeFrame == "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const data = await EventModel.aggregate([
      {
        $match: {
          organiser: new mongoose.Types.ObjectId(organiserId),
          status: "published",
          date: { $gte: startDate },
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          revenue: { $multiply: ["$ticketPrice", "$ticketsSold"] },
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

    const events = await EventModel.find({
      organiser: organiserId,
      date: { $gte: startDate },
    });
    const completedEvents = await EventModel.find({
      organiser: organiserId,
      status: "completed",
      date: { $gte: startDate },
    });
    const topEvents = [...events]
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5);
    let organiserEarning = 0;
    let totalAttendees = 0;
    completedEvents.forEach((event) => {
  let ticketRevenue = 0;
  let totalAdminCut = 0;
  let attendees = 0;

  if (event.ticketTypes && event.ticketTypes.length > 0) {
    // ✅ Multiple ticket types
    event.ticketTypes.forEach((t) => {
      const revenue = (t.price ?? 0) * (t.sold ?? 0);
      const adminCut = revenue * (adminCommissionPercentage / 100);

      ticketRevenue += revenue;
      totalAdminCut += adminCut;
      attendees += t.sold ?? 0;
    });
  } else {
    // ✅ Old model (single ticket price)
    const revenue = (event.ticketPrice ?? 0) * (event.ticketsSold ?? 0);
    const adminCut = revenue * (adminCommissionPercentage / 100);

    ticketRevenue += revenue;
    totalAdminCut += adminCut;
    attendees += event.ticketsSold ?? 0;
  }

  organiserEarning += ticketRevenue - totalAdminCut;
  totalAttendees += attendees;
});
   
     const totalEvents = events.length;

    const upcomingEvents = events
      .filter((event) => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    return {
      events,
      data: adjustedData,
      adminCommissionPercentage,
      organiserEarning,
      totalEvents,
      totalAttendees,
      topEvents,
      upcomingEvents,
    };
  }
  async getOrgEvents(organiserId: string): Promise<IEvent[]> {
    return await EventModel.find({ organiser: organiserId });
  }
  async findEvent(eventName: string): Promise<IEvent | null> {
    const trimmedName = eventName.trim().replace(/\s+/g, "");
    const regex = new RegExp(trimmedName.split("").join("\\s*"), "i");

    return await EventModel.findOne({
      title: { $regex: regex },
    });
  }
  async findEventsByCat(category: string): Promise<IEvent[]> {
    return await EventModel.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });
  }
  async findRecommended(
    userId: string,
    filters: IEventFilter
  ): Promise<Recommend> {
    try {
      const {
        searchTerm,

        maxPrice,
        selectedDate,

        page = 1,
        limit = 3,
      } = filters;
      const skip = (page - 1) * limit;

      const query: FilterQuery<IEvent> = {
        isBlocked: false,
        status: "published",
        date: { $gte: new Date() },
      };
      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { venue: { $regex: searchTerm, $options: "i" } },
        ];
      }
      if (maxPrice) {
        query.ticketPrice = { $lte: maxPrice };
      }

      if (selectedDate) {
        const date = new Date(selectedDate);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query.date = { $gte: date, $lt: nextDay };
      }

      const latestOrder = await Order.findOne({ userId }).sort({
        createdAt: -1,
      });
      if (!latestOrder) {
        throw new Error("latest order does not exist");
      }

      const eventId = latestOrder.eventId;
      const event = await EventModel.findById(eventId).lean<IEventDTO>().exec();

      query._id = { $ne: eventId };
      const events = await EventModel.find(query)
        .skip(skip)
        .limit(limit)
        .lean<IEventDTO[]>()
        .exec();
       
        

      if (!event) {
        return { events };
      }
      return { event: event, events: events, success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
async findNear({ lat, lng }: Location,filters:IEventFilter): Promise<IEventDTO[]> {

   const {
        searchTerm,

        maxPrice,
        selectedDate,

       
      } = filters;
    
      const query: FilterQuery<IEvent> = {
        isBlocked: false,
        status: "published",
        date: { $gte: new Date() },
      };
      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { venue: { $regex: searchTerm, $options: "i" } },
        ];
      }
      if (maxPrice) {
        query.ticketPrice = { $lte: maxPrice };
      }

      if (selectedDate) {
        const date = new Date(selectedDate);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query.date = { $gte: date, $lt: nextDay };
      }
      
   


    return await EventModel.find({
      
      ...query,
      location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: 200000,
      },
    },
    });
    
  }
  async getAllEvents():Promise<{images:(string | IEventImage)[],title:string}[]>{
    try {
     return await EventModel.find({}, { title: 1, images: 1, _id: 1 }).sort({ date: -1 });
      
    } catch (error) {
      console.log(error);
      return []
      
      
    }
  }
  async getTrending():Promise<{images:(string | IEventImage)[],title:string}[]>{
    try {
     return await EventModel.find({status:"published"}, { title: 1, images: 1, _id: 1 }).sort({ ticketsSold:-1 }).limit(5);
      
    } catch (error) {
      console.log(error);
      return []
      
      
    }
  }
  async findOrders(eventId:string):Promise<IOrderDTO[]>{
    return await Order.find({eventId:eventId})

  }
  async updateEventDate(eventId:string,date:string):Promise<IEvent|null>{
    try {
       const updatedEvent=await EventModel.findByIdAndUpdate(eventId,{date},{new:true})
       return updatedEvent
      
    } catch (error) {
      console.error("Error updating event date:", error);
    throw error; 
      
    }
   

  }
  async findOrg(orgId:string):Promise<IOrganiser|null>{
    try {
      return await Organiser.findById(orgId)
      
    } catch (error) {
       console.error("Error updating event date:", error);
    throw error; 
      
    }

  }
  async findUser(userId:string):Promise<IUser|null>{
    try {
      return await User.findById(userId)
      
    } catch (error) {
       console.error("Error updating event date:", error);
    throw error; 
      
    }

  }
  

}
