import { Request, Response } from "express";
import { IAdminOrgController } from "./controllerInterface/IAdminOrgController";
import { IAdminOrgService } from "src/services/serviceInterface/IAdminOrgService";
import { EditOrg } from "src/interface/event";
import { IOrganiser, IOrganiserDTO } from "src/interface/IOrgAuth";
import { StatusCode } from "../constants/statusCodeEnum";
import { mapOrganiserToDTO } from "../utils/mapOrganiserToDTO";
import { organiserSocketMap } from "../socketMap";
import { io } from "../index";
import { MESSAGES } from "../constants/messages";
export class AdminOrgController implements IAdminOrgController {
  constructor(private _adminOrgService: IAdminOrgService) {}
  async getAllOrganisers(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 5;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const searchTerm=typeof req.query.searchTerm==="string"?req.query.searchTerm:"";
      const filterStatus=typeof req.query.filterStatus==="string"?req.query.filterStatus:""

<<<<<<< HEAD
       const sortBy=typeof req.query.sortBy==="string"?req.query.sortBy:""
      



      const result = await this._adminOrgService.getOrganiser(limit, page,searchTerm,filterStatus,sortBy);
=======

      const result = await this._adminOrgService.getOrganiser(limit, page,searchTerm,filterStatus);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      if (result.success && result.result) {
        const mappedOrganisers: IOrganiserDTO[] =
          result.result.map(mapOrganiserToDTO);
        res.json({
          result: mappedOrganisers,
          message: result.message,
          success: true,
          total: result.total,
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
  async updateOrganiser(
    req: Request<{ id: string }, unknown, EditOrg>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const formData = req.body;
      const result = await this._adminOrgService.organiserUpdate(id, formData);
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
  async blockOrganiser(
    req: Request<unknown, unknown, IOrganiser>,
    res: Response
  ): Promise<void> {
    try {
      const organiser = req.body;
      const organiserId = organiser._id;
      const result = await this._adminOrgService.organiserBlock(organiser);
      if (result.success && result.organiser) {
        if (result.organiser.isBlocked) {
          const socketId = organiserSocketMap.get(organiserId.toString());
          if (socketId) {
            io.to(socketId).emit("logout");
            console.log(`Forced logout emitted for user ${organiserId}`);
          }
        }

        res.json({ success: true, message: "Organiser blocked successfully" });
      } else {
        res.json({ success: false, message: "failed to block" });
      }
    } catch (error) {
      console.log(error);

      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.COMMON.SERVER_ERROR });
    }
  }
}
