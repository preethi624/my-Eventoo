import { Request, Response } from "express";
import { IAdminEventController } from "./controllerInterface/IAdminEventController";
import { IAdminEventService } from "src/services/serviceInterface/IAdminEventService";
import { EditEvent, IEventFilter } from "src/interface/event";
import { IEvent } from "src/model/event";
import { StatusCode } from "../constants/statusCodeEnum";
import { ParsedQs } from "qs";
import { MESSAGES } from "../constants/messages";
export class AdminEventController implements IAdminEventController {
  constructor(private _adminEventService: IAdminEventService) {}
  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as ParsedQs;
      const filters: IEventFilter = {
        searchLocation:
          typeof query.searchLocation === "string" ? query.searchLocation : "",
        searchTitle:
          typeof query.searchTitle === "string" ? query.searchTitle : "",
        orgName: typeof query.orgName === "string" ? query.orgName : "",
        selectedCategory:
          typeof query.selectedCategory === "string"
            ? query.selectedCategory
            : "",
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
        selectedDate:
          typeof query.selectedDate === "string" ? query.selectedDate : "",
        page: query.page ? Number(query.page) : undefined,
        limit:
          query.limit && !isNaN(Number(query.limit))
            ? Number(query.limit)
            : undefined,
      };

      const result = await this._adminEventService.getEvents(filters);

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
  async eventEdit(
    req: Request<{ id: string }, unknown, EditEvent>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const formData = req.body;
      const result = await this._adminEventService.editEvent(id, formData);
      if (result.success) {
        res.json({ success: true, message: "edited successfully" });
        return;
      } else {
        res.json({ success: false, message: "failed to edit" });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }

  async blockEvent(
    req: Request<unknown, unknown, IEvent>,
    res: Response
  ): Promise<void> {
    try {
      const event = req.body;
      const result = await this._adminEventService.eventBlock(event);

      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const response = await this._adminEventService.dashboardGet();
      if (response.success) {
        res.json({
          success: true,
          message: "successfully fetch",
          monthlyRevenue: response.monthlyRevenue,
          topEvents: response.topEvents,
          eventCategories: response.eventCategories,
          totalRevenue: response.totalRevenue,
          activeEvents: response.activeEvents,
        });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
}
