import { FilterQuery, PipelineStage } from "mongoose";
import { IAdminOrder } from "src/interface/IAdmin";
import Order, { IOrder } from "../model/order";
import { IAdminOrderRepository } from "./repositoryInterface/IAdminOrderRepository";
import { OrderDashboard } from "src/interface/IUser";
import PlatformSettings from "../model/platformSettings";

export class AdminOrderRepository implements IAdminOrderRepository {
  async getOrdersAll(filters: {
    searchTerm?: string;
    statusFilter?: string;
    selectedDate?: string;
    page?: number;
    limit?: number;
    organiser?: string;
    user?: string;
  }): Promise<IAdminOrder> {
    const {
      searchTerm = "",
      statusFilter = "",
      selectedDate = "",
      page = 1,
      limit = 6,
      organiser = "",
      user = "",
    } = filters;

    const skip = (page - 1) * limit;

    const match: FilterQuery<IOrder> = {};

    // Filter by booking status
    if (statusFilter) {
      match.bookingStatus = { $regex: statusFilter, $options: "i" };
    }

    // Filter by createdAt date
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      match.createdAt = { $gte: date, $lt: nextDay };
    }

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
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
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $lookup: {
          from: "organisers",
          localField: "eventDetails.organiser",
          foreignField: "_id",
          as: "organiserDetails",
        },
      },
      { $unwind: "$organiserDetails" },
      {
        $match: {
          ...match,
          ...(searchTerm
            ? {
                $or: [
                  {
                    "eventDetails.title": { $regex: searchTerm, $options: "i" },
                  },
                  { _id: { $regex: searchTerm, $options: "i" } },
                ],
              }
            : {}),
          ...(organiser
            ? { "organiserDetails.name": { $regex: organiser, $options: "i" } }
            : {}),
          ...(user
            ? { "userDetails.name": { $regex: user, $options: "i" } }
            : {}),
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [orders, countData] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate([
        ...pipeline.slice(0, -2), // remove skip & limit
        { $count: "total" },
      ]),
    ]);

    const totalCount = countData[0]?.total || 0;

    return {
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      orders,
    };
  }
  async getDashboardOrders(
    timeFrame: "7d" | "30d" | "90d",
    startDate?: string,
    endDate?: string,
    category?: string,
    month?: string,
    year?: string
  ): Promise<OrderDashboard> {
    /*let stDate: Date;
  let enDate: Date | undefined;

  if (startDate && endDate) {
    stDate = new Date(startDate);
    enDate = new Date(endDate);
  } else {
    const days = timeFrame === '7d' ? 7 : timeFrame === '30d' ? 30 : 90;
    stDate = new Date();
    stDate.setDate(stDate.getDate() - days);
  }*/
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
      "eventDetails.status": "completed",
      createdAt: enDate ? { $gte: stDate, $lte: enDate } : { $gte: stDate },
    };

    if (category) {
      eventMatchCondition["eventDetails.category"] = category;
    }

    const orders = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
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
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "organisers",
          localField: "event.organiser",
          foreignField: "_id",
          as: "organiser",
        },
      },
      { $unwind: "$organiser" },
      {
        $project: {
          _id: 0,
          date: "$createdAt",
          id: "$orderId",
          user: "$user.name",
          event: "$event.title",
          eventDate: "$event.date",
          eventStatus: "$event.status",
          organiserName: "$organiser.name",
          organiserEmail: "$organiser.email",
          amount: 1,
          status: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$bookingStatus", "confirmed"] },
                  then: "Completed",
                },
                {
                  case: { $eq: ["$bookingStatus", "cancelled"] },
                  then: "Failed",
                },
              ],
              default: "Pending",
            },
          },
        },
      },
    ]);

    const settings = await PlatformSettings.findOne();
    const adminCommissionPercentage = settings?.adminCommissionPercentage ?? 10;

    const salesReport = await Order.aggregate([
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
        $lookup: {
          from: "organisers",
          localField: "eventDetails.organiser",
          foreignField: "_id",
          as: "organiserDetails",
        },
      },
      { $unwind: "$organiserDetails" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $match: eventMatchCondition },
      {
        $addFields: {
          adminEarning: {
            $multiply: [
              {
                $divide: [
                  { $multiply: ["$amount", adminCommissionPercentage] },
                  100,
                ],
              },
              "$ticketCount",
            ],
          },
        },
      },

      {
        $project: {
          _id: 0,
          event: "$eventDetails.title",
          eventDate: "$eventDetails.date",

          ticketPrice: "$eventDetails.ticketPrice",
          user: "$userDetails.name",
          organiserName: "$organiserDetails.name",
          organiserEmail: "$organiserDetails.email",
          adminEarning: 1,
        },
      },
    ]);

    const totalAdminEarning =
      salesReport.reduce((sum, record) => sum + (record.adminEarning || 0), 0) /
      100;

    return { orders, salesReport, totalAdminEarning };
  }
}
