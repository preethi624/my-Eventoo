import { Request, Response } from "express";
import { EditOrg } from "src/interface/event";
import { IOrganiser } from "src/interface/IOrgAuth";
export interface IAdminOrgController{
    getAllOrganisers(req:Request,res:Response):Promise<void>;
  updateOrganiser(req: Request<{id:string}, unknown,EditOrg>,  res: Response):Promise<void>;
  blockOrganiser(req: Request<unknown, unknown,IOrganiser>,  res: Response):Promise<void>
}