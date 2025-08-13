
import { IEventService } from "./serviceInterface/IEventService";
import { IEventRepository } from "../repositories/repositoryInterface/IEventRepository";
import {
  CreateEvent,
  DashboardEvents,
  EventByCat,
  EventById,
  EventCount,
  EventEdit,
  EventFind,
  EventGet,
  IEventFilter,
  StatusCheck,
} from "../interface/event";
import { IEventDTO } from "src/interface/IEventDTO";
import { MESSAGES } from "../constants/messages";
export class EventService implements IEventService {
  constructor(private _eventRepository: IEventRepository) {}
  async eventGet(filters: IEventFilter): Promise<EventGet> {
    try {
      const response = await this._eventRepository.getEvents(filters);
      

      if (response) {
        return {
          response,
          success: true,
          message: "Event fetched successfully",
        };
      } else {
        return { success: false, message: "No events found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting events" };
    }
  }
  async eventGetById(id: string): Promise<EventById> {
    try {
      const result = await this._eventRepository.getEventById(id);
      if (result) {
        return {
          result,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
    }
  }
  async eventCreate(data: IEventDTO): Promise<CreateEvent> {
    try {
      const result = await this._eventRepository.createEvent(data);

      if (result) {
        return { success: true, message: MESSAGES.EVENT.SUCCESS_TO_CREATE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
    }
  }
  async eventDelete(id: string): Promise<CreateEvent> {
    try {
      const result = await this._eventRepository.eventDelete(id);
      if (result) {
        return { success: true, message: MESSAGES.EVENT.FAILED_TO_DELETE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_DELETE };
      }
    } catch (error) {
      console.log(error);

      return { success: false, message: "failed to delete event" };
    }
  }
  async eventEdit(id: string, data: EventEdit): Promise<CreateEvent> {
    try {
      const result = await this._eventRepository.editEvent(id, data);
      if (result) {
        return { success: true, message: MESSAGES.EVENT.SUCCESS_TO_UPDATE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE };
      }
    } catch (error) {
      console.log(error);

      return { success: false, message: "failed to edit event" };
    }
  }
  async statusCheck(email: object): Promise<StatusCheck> {
    try {
      const result = await this._eventRepository.statusCheck(email);
      if (result) {
        return { result: result, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getEvent(
    id: string,
    limit: number,
    page: number,
    searchTerm: string,
    date: string
  ): Promise<EventGet> {
    try {
      const response = await this._eventRepository.eventGet(
        id,
        limit,
        page,
        searchTerm,
        date
      );

      if (response) {
        return {
          response,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: "No event found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "not getting event" };
    }
  }
  async eventCountGet(organiserId: string): Promise<EventCount> {
    try {
      const result = await this._eventRepository.getEventCount(organiserId);
      if (result) {
        return { count: result, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getDashboardEvents(
    organiserId: string,
    timeFrame: "7d" | "30d" | "90d"
  ): Promise<DashboardEvents> {
    try {
      const response = await this._eventRepository.dashboardEvents(
        organiserId,
        timeFrame
      );
      if (response) {
        return {
          success: true,
          events: response.events,
          message: "event fetched successfully",
          data: response.data,
          adminPercentage: response.adminCommissionPercentage,
          organiserEarning: response.organiserEarning,
          totalEvents: response.totalEvents,
          totalAttendees: response.totalAttendees,
          topEvents: response.topEvents,
          upcomingEvents: response.upcomingEvents,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed" };
    }
  }
  async getEvents(organiserId: string): Promise<EventGet> {
    try {
      const response = await this._eventRepository.getOrgEvents(organiserId);
      if (response) {
        return {
          success: true,
          result: response,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: "failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "failed" };
    }
  }
  async eventFind(eventName: string): Promise<EventFind> {
    try {
      const response = await this._eventRepository.findEvent(eventName);
      if (response) {
        return { success: true, result: response };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async eventsFindByCat(category: string): Promise<EventByCat> {
    try {
      const response = await this._eventRepository.findEventsByCat(category);
      if (response) {
        return { success: true, result: response };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
}