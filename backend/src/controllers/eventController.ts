import { IEventDTO } from "src/interface/IEventDTO";
import { IEventService } from "../services/serviceInterface/IEventService";
import { IEventController } from "./controllerInterface/IEventController";
import { Request, Response } from "express";
import { EventEdit, IEventFilter } from "src/interface/event";
import { ParsedQs } from "qs";

import { StatusCode } from "../constants/statusCodeEnum";
import { MESSAGES } from "../constants/messages";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class EventController implements IEventController {
  constructor(private _eventService: IEventService) {}

  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as ParsedQs;
      const filters: IEventFilter = {
        searchLocation:
          typeof query.searchLocation === "string" ? query.searchLocation : "",
        searchTitle:
          typeof query.searchTitle === "string" ? query.searchTitle : "",
        selectedCategory:
          typeof query.selectedCategory === "string"
            ? query.selectedCategory
            : "",
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
        selectedDate:
          typeof query.selectedDate === "string" ? query.selectedDate : "",
        page: query.page ? Number(query.page) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
      };
      
      

      const result = await this._eventService.eventGet(filters);

      if (result) {
        res.json({ result: result, success: true });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const response = await this._eventService.eventGetById(id);
      if (response) {
        res.json({ result: response, success: true });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async createEvent(
    req: Request<unknown, unknown, IEventDTO>,
    res: Response
  ): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      const eventData = {
        ...req.body,
        images: files?.map((file: Express.Multer.File) => file.path) || [],
      };

      const response = await this._eventService.eventCreate(eventData);
      if (response.success) {
        res.json({ success: true, message: MESSAGES.EVENT.SUCCESS_TO_CREATE });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_CREATE,
      });
    }
  }
  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log("id", id);

      const response = await this._eventService.eventDelete(id);
      if (response.success) {
        res.json({ success: true, messge: MESSAGES.EVENT.SUCCESS_TO_DELETE });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_DELETE });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_DELETE,
      });
    }
  }
  async editEvent(
    req: Request<{ id: string }, unknown, EventEdit>,
    res: Response
  ): Promise<void> {
    try {
      console.log("req", req.body);

      const data = req.body;
      const id = req.params.id;
      const response = await this._eventService.eventEdit(id, data);
      if (response.success) {
        res.json({ success: true, message: MESSAGES.EVENT.SUCCESS_TO_UPDATE });
      } else {
        res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_UPDATE,
      });
    }
  }
  async checkStatus(
    req: Request<unknown, unknown, object>,
    res: Response
  ): Promise<void> {
    try {
      const result = req.body;

      const response = await this._eventService.statusCheck(result);
      if (response) {
        res.json({ user: response, success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_CREATE,
      });
    }
  }
  async eventGet(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 5;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const searchTerm = req.query.searchTerm as string;
      const date = req.query.date as string;

      const response = await this._eventService.getEvent(
        id,
        limit,
        page,
        searchTerm,
        date
      );
      console.log("response", response);

      if (response) {
        res.json({ result: response, success: true });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async getEventCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organiserId = req.user?.id;
      if (!organiserId) {
        throw new Error("organiserId not get");
      }
      const response = await this._eventService.eventCountGet(organiserId);
      if (response) {
        res.json({ result: response, success: true });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async getDashboardEvents(req: Request, res: Response): Promise<void> {
    try {
      const organiserId = (req.params.organiserId as string) || "";
      const timeFrame = (req.query.timeFrame as "7d" | "30d" | "90d") || "30d";
      const response = await this._eventService.getDashboardEvents(
        organiserId,
        timeFrame
      );

      if (response.success) {
        res.json({
          success: true,
          events: response.events,
          data: response.data,
          adminPercentage: response.adminPercentage,
          organiserEarning: response.organiserEarning,
          totalEvents: response.totalEvents,
          totalAttendees: response.totalAttendees,
          topEvents: response.topEvents,
          upcomingEvents: response.upcomingEvents,
        });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async getOrgEvents(req: Request, res: Response): Promise<void> {
    try {
      const organiserId = (req.params.orgId as string) || "";
      const response = await this._eventService.getEvents(organiserId);
      if (response) {
        res.json({ events: response.result, success: true });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.COMMON.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async findEvent(req: Request, res: Response): Promise<void> {
    const eventName = req.query.name as string;
    try {
      const response = await this._eventService.eventFind(eventName);
      if (response.success) {
        res.json({ result: response.result });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async findEventsByCat(req: Request, res: Response): Promise<void> {
    const category = req.query.name as string;
    try {
      const response = await this._eventService.eventsFindByCat(category);
      if (response.success) {
        res.json({ result: response.result });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
}
