import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeEnum";
import { IAdminVenueController } from "./controllerInterface/IAdminVenueController";
import { IAdminVenueService } from "src/services/serviceInterface/IAdminVenueService";
import { ParsedQs } from "qs";
import { VenueFilters } from "src/interface/IVenue";
import { MESSAGES } from "../constants/messages";
export class AdminVenueController implements IAdminVenueController {
  constructor(private _adminVenueService: IAdminVenueService) {}
  async createVenue(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      let seatTypes = [];
    if (req.body.seatTypes) {
      try {
        seatTypes = JSON.parse(req.body.seatTypes);
      } catch (err) {
        console.error("Failed to parse seatTypes:", err);
      }
    }
      const venueData = {
        ...req.body,
        seatTypes,
        images: files?.map((file: Express.Multer.File) => file.path) || [],
      };
      console.log("venue", venueData);

      const response = await this._adminVenueService.venueCreate(venueData);
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
  async fetchVenues(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as ParsedQs;
      const filters: VenueFilters = {
        searchTerm:
          typeof query.searchTerm === "string" ? query.searchTerm : "",

        page: query.page ? Number(query.page) : undefined,
        limit:
          query.limit && !isNaN(Number(query.limit))
            ? Number(query.limit)
            : undefined,
      };
      const response = await this._adminVenueService.venuesFetch(filters);
      if (response.success) {
        res.json({
          successs: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
          venues: response.venues,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        });
      } else {
        res.json({ successs: false, message: MESSAGES.EVENT.FAILED_TO_FETCH });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_FETCH,
      });
    }
  }
  async editVenue(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
    
      
      const response = await this._adminVenueService.venueEdit(updateData);
      if (response.success) {
        res.json({ successs: true, message: MESSAGES.EVENT.SUCCESS_TO_UPDATE });
      } else {
        res.json({ successs: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_UPDATE,
      });
    }
  }
  async deleteVenue(req: Request, res: Response): Promise<void> {
    try {
      const venueId = req.params.venueId;

      const response = await this._adminVenueService.venueDelete(venueId);
      if (response.success) {
        res.json({ successs: true, message: MESSAGES.EVENT.SUCCESS_TO_DELETE });
      } else {
        res.json({ successs: false, message: MESSAGES.EVENT.FAILED_TO_DELETE });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.EVENT.FAILED_TO_DELETE,
      });
    }
  }
}
