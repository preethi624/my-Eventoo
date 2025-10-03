import {
  GetOrder,
  GetOrders,
  GetTickets,
  Order,
  OrderCreate,
  OrderCreateInput,
  RazorpayPaymentResponse,
  
  Update,
  UserProfileUpdate,
  VerifyResponse,
} from "src/interface/IPayment";
import { IPaymentService } from "./serviceInterface/IPaymentService";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import { IPaymentRepository } from "src/repositories/repositoryInterface/IPaymentRepository";
import { IEventRepository } from "src/repositories/repositoryInterface/IEventRepository";
import { generateOrderId } from "../utils/generateOrderId";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";
import { ITicket } from "src/model/ticket";
import { IEvent } from "src/model/event";
import { ITicketDetails } from "src/interface/ITicket";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function generateTicketPDF(
  order: Order,
  tickets: ITicket[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    (async () => {
      doc.fontSize(20).text(order.eventTitle, { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Order ID: ${order.orderId}`);

      doc.text(`Tickets Booked: ${order.ticketCount}`);

      doc.moveDown();

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: "qrcode",
          text: ticket.qrToken,
          scale: 3,
          height: 12,

          includetext: true,
        });

        doc.fontSize(12).text(`Ticket ${i + 1} - ID: ${ticket._id}`);
        const x = doc.x;
        const y = doc.y + 10;
        doc.image(barcodeBuffer, x, y, { width: 250 });

        doc.moveDown(3);
      }

      doc.end();
    })();
  });
}

export class PaymentService implements IPaymentService {
  constructor(
    private _paymentRepository: IPaymentRepository,
    private _eventRepository: IEventRepository
  ) {}

  async orderCreate(data: OrderCreateInput): Promise<OrderCreate> {
    const orderId = generateOrderId();
    try {
      const totalPrice = data.totalPrice;
      const ticketCount = data.ticketCount;
      const userId = data.userId;
      const eventId = data.eventId;
      const eventTitle = data.eventTitle;
      const email = data.email;
      const selectedTicket=data.selectedTicket
      const createdAt = new Date();

      const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: "receipt_order_74394",
      };
      const order = await razorpay.orders.create(options);

      const response = await this._paymentRepository.createOrder({
        razorpayOrderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt ?? "default_receipt_id",
        status: order.status,
        ticketCount,
        userId,
        eventId,
        eventTitle,
        selectedTicket,
        createdAt,
        orderId: orderId,
        email,
      });
      if (response) {
        return {
          success: true,
          message: "order created successfully",
          order: response,
        };
      } else {
        return { success: false, message: "Not enough tickets to sail" };
      }
    } catch (error) {
     if (error instanceof Error) {
    console.error('MongoDB connection error:', error.message);
     return {
        success: false,
        message: error?.message || "not creating order",
      };
  } else {
    console.error('MongoDB connection error:', error);
     return {
        success: false,
        message:  "not creating order",
      };
  }
     
    }
  }
  async orderCreateFree(
    data: OrderCreateInput
  ): Promise<{ success?: boolean }> {
    const orderId = generateOrderId();
    try {
      const ticketCount = data.ticketCount;
      const userId = data.userId;
      const eventId = data.eventId;
      const eventTitle = data.eventTitle;
      const createdAt = new Date();
      const response = await this._paymentRepository.createOrderFree({
        ticketCount,
        userId,
        eventId,
        eventTitle,
        createdAt,
        orderId: orderId,
        status: "Not required",
        bookingStatus: "confirmed",
      });
      if (response) {
        return {
          success: true,
        };
      }

      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async paymentVerify(data: RazorpayPaymentResponse): Promise<VerifyResponse> {
    try {
      const razorpay_payment_id = data.razorpay_payment_id;
      const razorpay_order_id = data.razorpay_order_id;
      const razorpay_signature = data.razorpay_signature;
      const secret = process.env.RAZORPAY_KEY_SECRET;
    

      
      if (!secret) {
        throw new Error(
          "RAZORPAY_KEY_SECRET is not defined in environment variables."
        );
      }

      const hmac = crypto.createHmac("sha256", secret);
      
      
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generatedSignature = hmac.digest("hex");

      
      

      if (generatedSignature !== razorpay_signature) {
        return { success: false, message: "Payment verification failed" };
      }
     


      const updatedOrder = await this._paymentRepository.updatePaymentDetails(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        "paid"
      );

      if (!updatedOrder) {
        console.warn(
          "No matching order found for Razorpay Order ID:",
          razorpay_order_id
        );
        return {
          success: false,
          message: "Order not found or already processed",
        };
      }

      const event = updatedOrder.eventId as unknown as IEvent;

      const tickets = await this._paymentRepository.getTickets(
        updatedOrder._id
      );

      const pdfBuffer = await generateTicketPDF(updatedOrder, tickets);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedOrder?.email,
        subject: `Your ticket for ${updatedOrder.eventTitle}`,
        html: `<h3>Thank you for booking!</h3>
        <p>Event: <b>${updatedOrder.eventTitle}</b></p>
        <p>Tickets: <b>${updatedOrder.ticketCount}</b></p>
        <p>Order ID: ${updatedOrder.orderId}</p>
        <p>Venue: ${event.venue}</p>
        <p>Date: ${event.date}</p>`,
        attachments: [
          {
            filename: "ticket.pdf",
            content: pdfBuffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log("payment verified");
      

      return {
        success: true,
        message: "Payment verified and ticket sent to email",
      };
    } catch (error) {
      if(error instanceof Error){
        console.log("error",error);
        
        return { success: false, message: error.message };

      }else{
      
           console.log("error",error);
         return { success: false, message: "Payment verification failed" };
         
      }
     
     
    }
  }

  async paymentFailure(
    payStatus: string,
    orderId: string,
    userId: string
  ): Promise<VerifyResponse> {
    try {
      const response = await this._paymentRepository.failurePayment(
        payStatus,
        orderId,
        userId
      );
      if (response) {
        return { success: true, message: "status updated" };
      } else {
        return { success: false, message: "failed to update status" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "failr=ed to update" };
    }
  }
  async ordersGet(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    status: string
  ): Promise<GetOrders> {
    try {
      const result = await this._paymentRepository.getOrders(
        id,
        limit,
        page,
        searchTerm,
        status
      );
      console.log("result", result);

      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          order: result,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }
  async orderGetById(userId: string, orderId: string): Promise<GetOrder> {
    try {
      const result = await this._paymentRepository.getOrderById(
        userId,
        orderId
      );
      if (result) {
        return {
          success: true,
          message: "orders fetched successfully",
          order: result,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }

  async ordersGetById(userId: string): Promise<UserProfileUpdate> {
    try {
      const result = await this._paymentRepository.getOrdersById(userId);
      if (result) {
        return {
          success: true,
          totalSpent: result.totalSpent,
          eventsBooked: result.eventsBooked,
        };
      } else {
        return { success: false, message: "failed to fetch" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed to fetch orders" };
    }
  }
  async orderFind(orderId: string): Promise<Update> {
    try {
      const result = await this._paymentRepository.findOrder(orderId);

      if (result) {
        const paymentId = result.razorpayPaymentId;
        const amount = result.amount;

        const payment = await razorpay.payments.fetch(paymentId);
        console.log(payment);
        

        const refund = await razorpay.payments.refund(paymentId, {
          amount: amount,
        });
        console.log("refund", refund);

        const refundId = refund.id;

        const response = await this._paymentRepository.updateRefund(
          refundId,
          orderId
        );
        if (response.success) {
          return {
            success: true,
            refundId: refundId,
            message: "successfully updated",
          };
        } else {
          return { success: false, message: response.message };
        }
      } else {
        return { success: false, message: "failed to update" };
      }
    } catch (error) {
      console.log(error);

      return { success: false, message: "failed to update" };
    }
  }

  async ticketsGet(orderId: string): Promise<GetTickets> {
    try {
      const result = await this._paymentRepository.getTickets(orderId);
      if (result) {
        return { success: true, result: result };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async ticketDetailsGet(
    userId: string,
    searchTerm: string,
    status: string,
    page: string,
    limit: string
  ): Promise<ITicketDetails> {
    try {
      const result = await this._paymentRepository.getTicketDetails(
        userId,
        searchTerm,
        status,
        page,
        limit
      );
      if (result) {
        return {
          success: true,
          tickets: result.tickets,
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
}
