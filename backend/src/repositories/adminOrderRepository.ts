import { FilterQuery, PipelineStage } from "mongoose";
import { IAdminOrder } from "src/interface/IAdmin";
import Order, { IOrder } from "../model/order";
import { IAdminOrderRepository } from "./repositoryInterface/IAdminOrderRepository";

export class AdminOrderRepository implements IAdminOrderRepository {
  async getOrdersAll(filters: {
    searchTerm?: string;
    statusFilter?: string;
    selectedDate?: string;
    page?: number;
    limit?: number;
    organiser?:string;
    user?:string;
  }):Promise<IAdminOrder> {
    const {
      searchTerm = '',
      statusFilter = '',
      selectedDate = '',
      page = 1,
      limit = 6,
      organiser='',
      user=''
    } = filters;

    const skip = (page - 1) * limit;

    const match: FilterQuery<IOrder>= {};

    // Filter by booking status
    if (statusFilter) {
      match.bookingStatus = { $regex: statusFilter, $options: 'i' };
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
    const pipeline: PipelineStage[]= [
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'eventDetails',
        },
      },
      { $unwind: '$eventDetails' },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $lookup: {
          from: 'organisers',
          localField: 'eventDetails.organiser',
          foreignField: '_id',
          as: 'organiserDetails',
        },
      },
      { $unwind: '$organiserDetails' },
      {
        $match: {
          ...match,
          ...(searchTerm
            ? {
                $or: [
                  { 'eventDetails.title': { $regex: searchTerm, $options: 'i' } },
                  { _id: { $regex: searchTerm, $options: 'i' } }, 
                  
                ],
              }
            : {}),
            ...(organiser
      ? { 'organiserDetails.name': { $regex: organiser, $options: 'i' } } 
      : {}),
    ...(user
      ? { 'userDetails.name': { $regex: user, $options: 'i' } }           
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
        { $count: 'total' },
      ]),
    ]);

    const totalCount = countData[0]?.total || 0;

    return {
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      orders,
    };
  }
}
