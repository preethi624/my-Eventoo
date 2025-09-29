
import { IAdminOrgService } from "./serviceInterface/IAdminOrgService";
import { IAdminOrgRepository } from "src/repositories/repositoryInterface/IAdminOrgRepository";
import { EditOrg } from "src/interface/event";
import { IMailService } from "./serviceInterface/IMailService";
import { GetOrganisers, GetOrgs, IOrganiser } from "src/interface/IOrgAuth";
import { MESSAGES } from "../constants/messages";

export class AdminOrgService implements IAdminOrgService {
  constructor(
    private _adminOrgRepository: IAdminOrgRepository,
    private mailService: IMailService
  ) {}
<<<<<<< HEAD
  async getOrganiser(limit: number, page: number,searchTerm:string,filterStatus:string,sortBy:string): Promise<GetOrganisers> {
=======
  async getOrganiser(limit: number, page: number,searchTerm:string,filterStatus:string): Promise<GetOrganisers> {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    try {
      const result = await this._adminOrgRepository.getOrganiserAll(
        limit,
        page,
        searchTerm,
<<<<<<< HEAD
        filterStatus,
        sortBy
=======
        filterStatus
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      );
      if (result) {
        return {
          result: result.result,
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
          total: result.total,
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
  async organiserUpdate(id: string, formData: EditOrg): Promise<GetOrgs> {
    try {
      const response = await this._adminOrgRepository.editOrganiser(
        id,
        formData
      );
      console.log("resee", formData);

      if (response) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: formData.email,
          subject: "Eventoo account status updated by admin",
          text: ` Your Eventoo account ${formData.status} by admin`,
        };
        this.mailService.sendMail(mailOptions);
        //await transporter.sendMail(mailOptions);
        return { success: true, message: "Organiser edit successfully" };
      } else {
        return { success: false, message: "failed to edit organiser" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: MESSAGES.COMMON.SERVER_ERROR,
      };
    }
  }
  async organiserBlock(organiser: IOrganiser): Promise<GetOrgs> {
    try {
      const response = await this._adminOrgRepository.blockOrganiser(organiser);

      if (response) {
        return {
          organiser: response,
          success: true,
          message: "Organiser blocked successfully",
        };
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
}