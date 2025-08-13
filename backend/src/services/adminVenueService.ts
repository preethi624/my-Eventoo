import {
  createVenue,
  EditVenue,
  VenueFetch,
  VenueFilters,
  VenueUpdate,
} from "src/interface/IVenue";
import { IVenue } from "src/model/venue";
import { IAdminVenueService } from "./serviceInterface/IAdminVenueService";
import { IAdminVenueRepository } from "src/repositories/repositoryInterface/IAdminVenueRepository";
import { MESSAGES } from "../constants/messages";

export class AdminVenueService implements IAdminVenueService {
  constructor(private _adminVenueRepository: IAdminVenueRepository) {}
  async venueCreate(venueData: IVenue): Promise<createVenue> {
    try {
      const result = await this._adminVenueRepository.createVenue(venueData);

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
  async venuesFetch(filters: VenueFilters): Promise<VenueFetch> {
    try {
      const response = await this._adminVenueRepository.fetchVenues(filters);
      if (response) {
        return {
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
          venues: response.venues,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_FETCH };
    }
  }
  async venueEdit(updateData: VenueUpdate): Promise<EditVenue> {
    try {
      const response = await this._adminVenueRepository.editVenue(updateData);
      if (response) {
        return { success: true, message: "updated successfully" };
      } else {
        return { success: false, message: "failed to update" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE };
    }
  }
  async venueDelete(venueId: string): Promise<EditVenue> {
    try {
      const response = await this._adminVenueRepository.deleteVenue(venueId);
      if (response.acknowledged && response.deletedCount === 1) {
        return { success: true, message: "deleted successfully" };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_DELETE };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_DELETE };
    }
  }
}
