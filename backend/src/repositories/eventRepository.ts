import { IEventDTO } from "src/interface/IEventDTO";
import EventModel, { IEvent } from "../model/event";
import { IEventRepository } from "./repositoryInterface/IEventRepository";
import mongoose, { DeleteResult, FilterQuery } from "mongoose";
<<<<<<< HEAD
import { EventEdit, GetEvent, IEventFilter, Location } from "src/interface/event";
=======
import { EventEdit, GetEvent, IEventFilter } from "src/interface/event";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { IUser } from "src/interface/IUserAuth";
import User from "../model/user";
import { BaseRepository } from "./baseRepository";
import PlatformSettings from "../model/platformSettings";

<<<<<<< HEAD
import dotenv from 'dotenv';
dotenv.config()

import Order from "../model/order";
import { Recommend } from "src/interface/IUser";
import Notification from "../model/notification";






=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
export class EventRepository
  extends BaseRepository<IEvent>
  implements IEventRepository
{
  constructor() {
    super(EventModel);
  }
  async getEvents(filters: IEventFilter): Promise<GetEvent | null> {
<<<<<<< HEAD
    

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
=======
    console.log("filters",filters);
    
    const {
      searchLocation,
      selectedCategory,
      maxPrice,
      selectedDate,
      searchTitle,
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      page = 1,
      limit = 6,
    } = filters;

    const skip = (page - 1) * limit;

    const query: FilterQuery<IEvent> = {
      isBlocked: false,
<<<<<<< HEAD
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
=======
      status: "published",
    };
    if (searchLocation) {
      query.venue = { $regex: searchLocation, $options: "i" };
    }
    if (searchTitle) {
      query.title = { $regex: searchTitle, $options: "i" };
    }
    if (selectedCategory) {
      query.category = {$regex:selectedCategory,$options:"i"};
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
    console.log("eventsee", events);
=======
      console.log("events",events);
      
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

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
<<<<<<< HEAD
    console.log("data",data);
    
    const event= await EventModel.create(data);
    await Notification.create({
      organizerId:event.organiser,
      type:"event_created",
      message:`Your event ${event.title} has been created successfully!`,
      isRead:false


    })
    return event
=======
    console.log("repdata", data);

    return await EventModel.create(data);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  }
  async eventDelete(id: string): Promise<DeleteResult> {
    return this.deleteById(id);
  }
  async editEvent(id: string, data: EventEdit): Promise<IEvent | null> {
<<<<<<< HEAD
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
=======
    const updatedData: Partial<IEvent> = {
      ...data,
      date: new Date(data.date),
      status: data.status as "draft" | "published" | "completed" | "cancelled",
    };
    if(data.capacity!==undefined){
      updatedData.availableTickets=data.capacity
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
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
=======
    date: string
  ): Promise<GetEvent | null> {
    const skip = (page - 1) * limit;
    const filter: {
      organiser: string;
      title?: { $regex: string; $options: string };
      venue?: { $regex: string; $options: string };

      date?: { $gte: Date; $lt: Date };
    } = {
      organiser: id,
    };
    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: "i" };
      filter.venue = { $regex: searchTerm, $options: "i" };
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
    const totalEvents = await EventModel.countDocuments(filter);
    
=======
    const totalEvents = await EventModel.countDocuments({ organiser: id });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
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
    /*completedEvents.forEach((event) => {
      //const ticketRevenue = event.ticketPrice * event.ticketsSold;
      let ticketRevenue = 0;

if (event.ticketTypes && event.ticketTypes.length > 0) {
  
  ticketRevenue = event.ticketTypes.reduce(
    (sum, t) => sum + (t.price ?? 0) * (t.sold ?? 0),
    0
  );
} else {
  
  ticketRevenue = (event.ticketPrice ?? 0) * (event.ticketsSold ?? 0);
}
=======
    completedEvents.forEach((event) => {
      const ticketRevenue = event.ticketPrice * event.ticketsSold;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      const adminCutPerTicket =
        (event.ticketPrice * adminCommissionPercentage) / 100;
      const totalAdminCut = adminCutPerTicket * event.ticketsSold;

      organiserEarning += ticketRevenue - totalAdminCut;
    });
<<<<<<< HEAD
   
    const totalAttendees = completedEvents.reduce(
      (sum, event) => sum + event.ticketsSold,
      0
    );*/
     const totalEvents = events.length;

=======
    const totalEvents = events.length;
    const totalAttendees = completedEvents.reduce(
      (sum, event) => sum + event.ticketsSold,
      0
    );
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
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
        $maxDistance: 50000,
      },
    },
    });
   
  }

=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}
