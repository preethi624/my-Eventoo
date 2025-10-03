import { Request, Response } from "express";
import {
  OrderCreateInput,
  RazorpayPaymentResponse,
} from "src/interface/IPayment";
import { IPaymentController } from "./controllerInterface/IPaymentController";
import { IPaymentService } from "src/services/serviceInterface/IPaymentService";

import { StatusCode } from "../constants/statusCodeEnum";

import { MESSAGES } from "../constants/messages";
import { AuthenticatedRequest } from "src/interface/AuthenticatedRequest";
export class PaymentController implements IPaymentController {
  constructor(private _paymentService: IPaymentService) {}
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const data: OrderCreateInput = req.body;

      const response = await this._paymentService.orderCreate(data);

      if (response.success && response.order) {
        res.json({
          message: MESSAGES.EVENT.SUCCESS_TO_CREATE,
          success: true,
          order: response.order,
        });
      } else {
        res.json({ success: false, message:response.message|| MESSAGES.EVENT.FAILED_TO_CREATE });
      }
    } catch (error) {
      console.error("Error in createOrder:", error);
      
    }
  }
  async createFreeOrder(req: Request, res: Response): Promise<void> {
    try {
      const data: OrderCreateInput = req.body;

      const response = await this._paymentService.orderCreateFree(data);

      if (response.success) {
        res.json({ message: MESSAGES.EVENT.SUCCESS_TO_CREATE, success: true });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE });
      }
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const data: RazorpayPaymentResponse = req.body;
      const response = await this._paymentService.paymentVerify(data);
      console.log("controller",response);
      

      if (response.success) {
        res.json({ message: "Payment verified successfully", success: true });
      } else {
        res.json({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      
    }
  }
  async failurePayment(req: Request, res: Response): Promise<void> {
    try {
      const { payStatus, orderId, userId } = req.body;
      const response = await this._paymentService.paymentFailure(
        payStatus,
        orderId,
        userId
      );
      if (response.success) {
        res.json({
          message: "failure status updated successfully",
          success: true,
        });
      } else {
        res.json({ success: false, message: "status updation failed failed" });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 5;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const searchTerm = req.query.searchTerm as string;
      const status = req.query.status as string;

      if (!userId) {
        throw new Error("id not get");
      }

      const response = await this._paymentService.ordersGet(
        userId,
        limit,
        page,
        searchTerm as string,
        status
      );
      if (response.success) {
        res.json({
          message: response.message,
          success: true,
          order: response.order,
        });
      } else {
        res.json({ message: MESSAGES.EVENT.FAILED_TO_FETCH, success: false });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { userId, orderId } = req.params;
      const response = await this._paymentService.orderGetById(userId, orderId);
      if (response.success) {
        res.json({
          message: response.message,
          success: true,
          order: response.order,
        });
      } else {
        res.json({ message: MESSAGES.EVENT.FAILED_TO_FETCH, success: false });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async getOrdersById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("tuserIs", userId);

      if (!userId) {
        throw new Error("userId not get");
      }
      const response = await this._paymentService.ordersGetById(userId);
      if (response) {
        res.json({
          totalSpent: response.totalSpent,
          eventsBooked: response.eventsBooked,
        });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async findOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const response = await this._paymentService.orderFind(orderId);
      if (response) {
        res.json({ response });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const response = await this._paymentService.ticketsGet(orderId);
      if (response) {
        res.json({ result: response.result, success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
  async getTicketDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const searchTerm = req.query.searchTerm as string;
      const status = req.query.status as string;
      const page=req.query.page as string;
      const limit=req.query.limit as string;
      console.log("limitNumbr",limit);
      


      const response = await this._paymentService.ticketDetailsGet(
        userId,
        searchTerm as string,
        status,page,limit
      );
      if (response) {
        res.json({ tickets: response.tickets, success: true ,totalPages:response.totalPages,totalItems:response.totalItems,currentPage:response.currentPage});
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error("Error in payment verification :", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      });
    }
  }
}
