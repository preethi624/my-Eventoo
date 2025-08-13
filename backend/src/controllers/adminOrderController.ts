import { StatusCode } from "../constants/statusCodeEnum";
import { IAdminOrderService } from "src/services/serviceInterface/IAdminOrderService";
import { Request, Response } from "express";
import { IAdminOrderController } from "./controllerInterface/IAdminOrderController";
import { IOrderFilter } from "src/interface/event";
import { MESSAGES } from "../constants/messages";

export class AdminOrderController implements IAdminOrderController {
  constructor(private _adminOrderService: IAdminOrderService) {}
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const filters: IOrderFilter = {
        searchTerm: req.query.searchTerm as string,
        statusFilter: req.query.status as string,
        selectedDate: req.query.date as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
        organiser: req.query.organiser as string,
        user: req.query.user as string,
      };

      const result = await this._adminOrderService.getOrders(filters);

      if (result.success) {
        res.json({ result: result, message: result.message, success: true });
      } else {
        res.json({ message: result.message, success: false });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
  async getDashboardOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        timeframe = "30d",
        startDate,
        endDate,
        selectedCategory,
        selectedMonth,
        selectedYear,
      } = req.query;

      const validTimeFrame = ["7d", "30d", "90d"].includes(timeframe as string)
        ? (timeframe as "7d" | "30d" | "90d")
        : "30d";
      const start = typeof startDate === "string" ? startDate : undefined;

      const end = typeof endDate === "string" ? endDate : undefined;

      const category =
        typeof selectedCategory === "string" ? selectedCategory : undefined;
      const month =
        typeof selectedMonth === "string" ? selectedMonth : undefined;
      const year = typeof selectedYear === "string" ? selectedYear : undefined;

      const result = await this._adminOrderService.getDashboard(
        validTimeFrame,
        start,
        end,
        category,
        month,
        year
      );

      if (result.success) {
        res.json({
          result: result.orders,
          message: result.message,
          success: true,
          salesReport: result.salesReport,
          totalAdminEarning: result.totalAdminEarning,
        });
      } else {
        res.json({ message: result.message, success: false });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
}
