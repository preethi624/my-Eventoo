import { EditEvent, GetEvent, IEventFilter } from "src/interface/event";
import EventModel, { IEvent } from "../model/event";
import { IAdminEventRepository } from "./repositoryInterface/IAdminEventRepository";
import { FilterQuery, PipelineStage } from "mongoose";
import { AdminDashboard } from "src/interface/IAdmin";
import PlatformSettings from "../model/platformSettings";
<<<<<<< HEAD
import Notification from "../model/notification";
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

export class AdminEventRepository implements IAdminEventRepository {
  async getEventsAll(filters: IEventFilter): Promise<GetEvent | null> {
    const {
      searchLocation,
      selectedCategory,
      maxPrice,
      selectedDate,
      searchTitle,
      page = 1,
<<<<<<< HEAD
      limit=6 ,
      
    } = filters;
    console.log("limit",limit);
    
=======
      limit = 6,
      orgName,
    } = filters;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

    const skip = (page - 1) * limit;

    const query: FilterQuery<IEvent> = {};
    if (searchLocation) {
      query.venue = { $regex: searchLocation, $options: "i" };
    }
    if (searchTitle) {
      query.title = { $regex: searchTitle, $options: "i" };
    }
    if (selectedCategory) {
      query.category = selectedCategory;
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
    const pipeline: PipelineStage[] = [
      { $match: query },
      {
        $lookup: {
          from: "organisers",
          localField: "organiser",
          foreignField: "_id",
          as: "organiserDetails",
        },
      },
      { $unwind: "$organiserDetails" },
    ];
    if (filters.orgName) {
      pipeline.push({
        $match: {
          "organiserDetails.name": {
            $regex: filters.orgName,
            $options: "i",
          },
        },
      });
    }
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );
    const events = await EventModel.aggregate(pipeline);
    const countPipeline = pipeline.filter(
      (stage) =>
        !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });
    const countData = await EventModel.aggregate(countPipeline);
    const total = countData[0]?.total || 0;

    return {
      totalPages: Math.ceil(total / limit),
      events,
      currentPage: page,
    };
  }
  async eventEdit(id: string, formData: EditEvent): Promise<IEvent | null> {
<<<<<<< HEAD
    try {
      const event=await EventModel.findByIdAndUpdate(id, formData, { new: true });
      if(!event) throw new Error("event not found")

     await Notification.create({
      organizerId:event.organiser,
      type:"general",
      message:`Your event ${event.title} has been edited by admin!`,
      isRead:false
       })
       return event

      
    } catch (error) {
      console.log(error);
      return null
      
      
    }
    

   

  }
  async blockEvent(event: IEvent): Promise<IEvent | null> {
    try {
       const id = event._id;
    if (!event.isBlocked) {
      const event=await EventModel.findByIdAndUpdate(
=======
    return await EventModel.findByIdAndUpdate(id, formData, { new: true });
  }
  async blockEvent(event: IEvent): Promise<IEvent | null> {
    const id = event._id;
    if (!event.isBlocked) {
      return await EventModel.findByIdAndUpdate(
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        id,
        { isBlocked: true },
        { new: true }
      );
<<<<<<< HEAD
      if(!event) throw new Error("event not found")
      
     await Notification.create({
      organizerId:event.organiser,
      type:"general",
      message:`Your event ${event.title} has been blocked by admin!`,
      isRead:false
       })
       return event

    } else {
      const event=await EventModel.findByIdAndUpdate(
=======
    } else {
      return await EventModel.findByIdAndUpdate(
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        id,
        { isBlocked: false },
        { new: true }
      );
<<<<<<< HEAD
      if(!event) throw new Error("event not found")
      await Notification.create({
      organizerId:event.organiser,
      type:"general",
      message:`Your event ${event.title} has been unblocked admin!`,
      isRead:false
       })
       return event
    }
    
      
    } catch (error) {
      console.log(error);
      return null
      
      
    }
   
     
=======
    }
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  }
  async getDashboard(): Promise<AdminDashboard> {
    const categoryColors: Record<string, string> = {
      music: "#8B5CF6",
      sports: "#06B6D4",
      technology: "#10B981",
      Others: "#F59E0B",
      arts: "#EF4444",
    };

    const settings = await PlatformSettings.findOne();
    const commissionRate = (settings?.adminCommissionPercentage ?? 10) / 100;
    const monthlyRevenue = await EventModel.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          revenue: {
            $sum: {
              $multiply: [
                { $multiply: ["$ticketPrice", "$ticketsSold"] },
                commissionRate,
              ],
            },
          },
          events: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          events: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const topEvents = await EventModel.aggregate([
      {
        $project: {
          title: 1,
          ticketsSold: 1,
          revenue: { $multiply: ["$ticketsSold", "$ticketPrice"] },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);
    const eventCategories = await EventModel.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
    ]);

    const categories = eventCategories.map((cat) => ({
      ...cat,
      color: categoryColors[cat.name] || "#9CA3AF",
    }));
<<<<<<< HEAD
   /* const completedEvents = await EventModel.find({ status: "completed" });
=======
    const completedEvents = await EventModel.find({ status: "completed" });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    let adminEarning = 0;
    completedEvents.forEach((event) => {
      const totalTickets = event.ticketsSold;
      const adminPerTicket = event.ticketPrice * commissionRate;
      const totalAdmin = adminPerTicket * totalTickets;

      adminEarning += totalAdmin;
<<<<<<< HEAD
    });*/
    const completedEvents = await EventModel.find({ status: "completed" });
let adminEarning = 0;

completedEvents.forEach((event) => {
  if (event.ticketTypes && event.ticketTypes.length > 0) {
    // ✅ New model: multiple ticket types
    event.ticketTypes.forEach((t) => {
      const revenue = (t.price ?? 0) * (t.sold ?? 0);
      const adminCut = revenue * commissionRate;
      adminEarning += adminCut;
    });
  } else {
    // ✅ Old model: single ticket price
    const totalTickets = event.ticketsSold ?? 0;
    const ticketPrice = event.ticketPrice ?? 0;
    const revenue = ticketPrice * totalTickets;
    const adminCut = revenue * commissionRate;
    adminEarning += adminCut;
  }
});

=======
    });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    const activeEvents = await EventModel.find({
      status: "published",
      isBlocked: false,
    });

    return {
      monthlyRevenue,
      message: "Dashboard data fetched successfully",
      success: true,
      topEvents,
      eventCategories: categories,
      totalRevenue: adminEarning,
      activeEvents: activeEvents.length,
    };
  }
}
