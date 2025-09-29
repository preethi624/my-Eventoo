"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const order_1 = __importDefault(require("../model/order"));
const mongoose_1 = __importDefault(require("mongoose"));
const event_1 = __importDefault(require("../model/event"));
const uuid_1 = require("uuid");
const ticket_1 = require("../model/ticket");
<<<<<<< HEAD
const notification_1 = __importDefault(require("../model/notification"));
class PaymentRepository {
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
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const updatedEvent = yield event_1.default.findOneAndUpdate({
                    _id: data.eventId,
                    "ticketTypes.type": (_a = data.selectedTicket) === null || _a === void 0 ? void 0 : _a.type,
                    "ticketTypes.capacity": { $gte: data.ticketCount },
                }, {
                    $inc: {
                        ticketsSold: data.ticketCount,
                        "ticketTypes.$[elem].sold": data.ticketCount,
                        availableTickets: -data.ticketCount,
                    },
                }, {
                    new: true,
                    session,
                    arrayFilters: [{ "elem.type": (_b = data.selectedTicket) === null || _b === void 0 ? void 0 : _b.type }],
                });
                if (!updatedEvent) {
                    throw new Error("Not enough tickets available for the selected type");
                }
                const lastOrder = yield order_1.default.findOne()
                    .sort({ bookingNumber: -1 })
                    .session(session);
                let nextBookingNumber = "BK-1000";
                if (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.bookingNumber) {
                    const lastNumber = parseInt(lastOrder.bookingNumber.replace("BK-", ""), 10);
                    nextBookingNumber = `BK-${lastNumber + 1}`;
                }
                const orderData = Object.assign(Object.assign({}, data), { bookingNumber: nextBookingNumber });
                const [order] = yield order_1.default.create([orderData], { session });
=======
class PaymentRepository {
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            /*console.log("repData", data);
        
           
               return await Order.create(data);*/
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const updatedEvent = yield event_1.default.findOneAndUpdate({ _id: data.eventId, availableTickets: { $gte: data.ticketCount } }, { $inc: { availableTickets: -data.ticketCount } }, { new: true, session });
                if (!updatedEvent) {
                    throw new Error("Not enough tickets available");
                }
                const [order] = yield order_1.default.create([data], { session });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                yield session.commitTransaction();
                return order;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
<<<<<<< HEAD
=======
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
    createOrderFree(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.create(data);
        });
    }
<<<<<<< HEAD
=======
    /*async updatePaymentDetails(
      orderId: string,
      paymentId: string,
      signature: string,
      status: string
     ): Promise<IOrder | null> {
      const session=await mongoose.startSession();
      session.startTransaction();
      try {
      
       const updateOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: status,
          bookingStatus: "confirmed",
        },
        { new: true ,session}
      );
  
      if (
        updateOrder &&
        updateOrder.eventId &&
        updateOrder.ticketCount &&
        updateOrder.bookingStatus === "confirmed"
      ) {
        const updatedEvent=await EventModel.findByIdAndUpdate(updateOrder.eventId._id, {
          $inc: { ticketsSold: updateOrder.ticketCount },
         
        },{new:true,session});
         if (!updatedEvent) {
        throw new Error("Not enough tickets available");
      }
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
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    updatePaymentDetails(orderId, paymentId, signature, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOrder = yield order_1.default.findOneAndUpdate({ razorpayOrderId: orderId }, {
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
                status: status,
<<<<<<< HEAD
                bookingStatus: "confirmed",
            }, { new: true });
            if (updateOrder &&
                updateOrder.eventId &&
                updateOrder.ticketCount &&
                updateOrder.bookingStatus === "confirmed") {
                yield event_1.default.findByIdAndUpdate(updateOrder.eventId._id, {
                    $inc: { ticketsSold: updateOrder.ticketCount },
                });
=======
                bookingStatus: "confirmed"
            }, { new: true });
            if (updateOrder && updateOrder.eventId && updateOrder.ticketCount && updateOrder.bookingStatus === "confirmed") {
                yield event_1.default.findByIdAndUpdate(updateOrder.eventId._id, { $inc: { ticketsSold: updateOrder.ticketCount } });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                const ticketsToInsert = [];
                for (let i = 0; i < updateOrder.ticketCount; i++) {
                    ticketsToInsert.push({
                        userId: updateOrder.userId,
                        orderId: updateOrder._id,
                        eventId: updateOrder.eventId,
                        qrToken: (0, uuid_1.v4)(),
                        issuedAt: new Date(),
<<<<<<< HEAD
                        checkedIn: false,
                    });
                }
                yield ticket_1.TicketModel.insertMany(ticketsToInsert);
                yield notification_1.default.create({
                    userId: updateOrder.userId,
                    message: `Your booking for event "${updateOrder.eventTitle}" has been confirmed! 🎉`,
                    type: "booking_confirmed",
                    isRead: false,
                });
=======
                        checkedIn: false
                    });
                }
                yield ticket_1.TicketModel.insertMany(ticketsToInsert);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            }
            return order_1.default.findById(updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder._id).populate("eventId").exec();
        });
    }
    getOrders(id, limit, page, searchTerm, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const orders = yield order_1.default.find({
                userId: id,
                eventId: { $ne: null, $exists: true },
            })
                .populate({
                path: "eventId",
            })
                .lean()
                .sort({ createdAt: -1 });
            const filteredOrder = orders.filter((order) => {
                var _a, _b, _c;
                if (!order.eventId)
                    return;
                const event = order.eventId;
                const eventTitle = ((_a = event.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                const orderId = ((_b = order.orderId) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                const search = (searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.toLowerCase()) || "";
                const matchSearch = eventTitle.includes(search) || orderId.includes(search);
                const matchStatus = !status ||
                    status === "all" ||
                    ((_c = order.bookingStatus) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === status.toLowerCase();
                return matchSearch && matchStatus;
            });
            const totalPages = Math.ceil(filteredOrder.length / limit);
            const paginatedOrders = filteredOrder.slice(skip, skip + limit);
            const formatedOrders = paginatedOrders.map((order) => {
                return Object.assign(Object.assign({}, order), { eventDetails: order.eventId, eventId: order.eventId._id });
            });
            return {
                orders: formatedOrders,
                totalPages,
                currentPage: page,
            };
        });
    }
    getOrderById(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.findOne({ userId: userId, _id: orderId }).populate({
                path: "eventId",
            });
        });
    }
    failurePayment(payStatus, orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
<<<<<<< HEAD
            try {
                const order = yield order_1.default.findOneAndUpdate({ userId, _id: orderId }, { status: payStatus }, { new: true });
                if (order && order.eventId) {
                    yield event_1.default.findByIdAndUpdate(order.eventId, {
                        $inc: { availableTickets: order.ticketCount },
                    });
                }
                if (!order)
                    throw new Error("order not found");
                yield notification_1.default.create({
                    userId: userId,
                    message: `Your booking for event "${order.eventTitle}" failed! `,
                    type: "booking_cancelled",
                    isRead: false,
                });
                return order;
            }
            catch (error) {
                console.log(error);
                return null;
            }
=======
            console.log("orderId", orderId);
            /* return await Order.findOneAndUpdate(
               { userId, _id: orderId },
               { status: payStatus },
               { new: true }
             );*/
            const order = yield order_1.default.findOneAndUpdate({ userId, _id: orderId }, { status: payStatus }, { new: true });
            if (order && order.eventId) {
                // Increment the available tickets in the event
                yield event_1.default.findByIdAndUpdate(order.eventId, {
                    $inc: { availableTickets: order.ticketCount }
                });
            }
            return order;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        });
    }
    getOrdersById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [stats] = yield order_1.default.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
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
                    totalSpent: (stats === null || stats === void 0 ? void 0 : stats.totalSpent) || 0,
                    eventsBooked: (stats === null || stats === void 0 ? void 0 : stats.eventsBooked) || 0,
                };
            }
            catch (error) {
                console.error("Error fetching user stats:", error);
                return { success: false, message: "Failed to fetch stats" };
            }
        });
    }
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.findById({ _id: orderId });
        });
    }
    updateRefund(refundId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
<<<<<<< HEAD
            var _a, _b;
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            try {
                console.log("refundid", refundId);
                const order = yield order_1.default.findById(orderId);
                if (!order)
                    throw new Error("Order not found");
                const eventId = order.eventId;
<<<<<<< HEAD
=======
                const ticketCount = order.ticketCount;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                yield order_1.default.findByIdAndUpdate(orderId, {
                    refundId: refundId,
                    status: "refunded",
                    bookingStatus: "cancelled",
                });
<<<<<<< HEAD
                yield event_1.default.findOneAndUpdate({
                    _id: eventId,
                    "ticketTypes.type": (_a = order.selectedTicket) === null || _a === void 0 ? void 0 : _a.type,
                }, {
                    $inc: {
                        ticketsSold: -order.ticketCount,
                        "ticketTypes.$[elem].sold": -order.ticketCount,
                        availableTickets: order.ticketCount,
                    },
                }, {
                    new: true,
                    arrayFilters: [{ "elem.type": (_b = order.selectedTicket) === null || _b === void 0 ? void 0 : _b.type }],
                });
                yield notification_1.default.create({
                    userId: order.userId,
                    message: `Your booking for event "${order.eventTitle}" refunded with amount ${order.amount / 100}! `,
                    type: "general",
                    isRead: false,
=======
                yield event_1.default.findByIdAndUpdate(eventId, {
                    $inc: { availableTickets: ticketCount },
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                });
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to refund" };
            }
        });
    }
    getTickets(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield ticket_1.TicketModel.find({ orderId: orderId })
                .populate("eventId")
                .exec();
            return tickets;
        });
    }
    getTicketDetails(userId_1) {
<<<<<<< HEAD
        return __awaiter(this, arguments, void 0, function* (userId, searchTerm = "", status = "", page, limit) {
            var _a;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 5;
            const skip = (pageNumber - 1) * limitNumber;
=======
        return __awaiter(this, arguments, void 0, function* (userId, searchTerm = "", status = "") {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            const matchStage = {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                },
            };
<<<<<<< HEAD
            // Base pipeline (without pagination)
            const basePipeline = [
=======
            const pipeline = [
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
            }
            else if (status === "past") {
                basePipeline.push({ $match: { "event.date": { $lt: now } } });
            }
            // ✅ Count documents before skip/limit
            const countPipeline = [...basePipeline, { $count: "total" }];
            const countResult = yield ticket_1.TicketModel.aggregate(countPipeline);
            const totalItems = ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
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
            const tickets = yield ticket_1.TicketModel.aggregate(dataPipeline);
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
            }
            else if (status === "past") {
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
            const tickets = yield ticket_1.TicketModel.aggregate(pipeline);
            return tickets;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        });
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=paymentRepository.js.map