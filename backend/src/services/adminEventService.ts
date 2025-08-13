import {
  CreateEvent,
  EditEvent,
  EventGet,
  IEventFilter,
} from "src/interface/event";
import { IEvent } from "src/model/event";
import { IAdminEventService } from "./serviceInterface/IAdminEventService";
import { IAdminEventRepository } from "src/repositories/repositoryInterface/IAdminEventRepository";
import { GetUsers } from "src/interface/IUserAuth";
import { AdminDashboard } from "src/interface/IAdmin";
import { MESSAGES } from "../constants/messages";

export class AdminEventService implements IAdminEventService {
  constructor(private _adminEventRepository: IAdminEventRepository) {}
  async getEvents(filters: IEventFilter): Promise<EventGet> {
    try {
      const response = await this._adminEventRepository.getEventsAll(filters);

      if (response) {
        return {
          response,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }

  async editEvent(id: string, formData: EditEvent): Promise<GetUsers> {
    try {
      const response = await this._adminEventRepository.eventEdit(id, formData);

      if (response) {
        return { success: true, message: MESSAGES.EVENT.SUCCESS_TO_UPDATE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }

  async eventBlock(event: IEvent): Promise<CreateEvent> {
    try {
      const response = await this._adminEventRepository.blockEvent(event);

      if (response) {
        if (response.isBlocked) {
          return { success: true, message: "Event blocked successfully" };
        } else {
          return { success: true, message: "Event unblocked successfully" };
        }
      } else {
        return { success: false, message: "failed to block" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async dashboardGet(): Promise<AdminDashboard> {
    try {
      const response = await this._adminEventRepository.getDashboard();
      if (response) {
        return {
          success: true,
          message: "fetched successfully",
          monthlyRevenue: response.monthlyRevenue,
          topEvents: response.topEvents,
          eventCategories: response.eventCategories,
          totalRevenue: response.totalRevenue,
          activeEvents: response.activeEvents,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
}
