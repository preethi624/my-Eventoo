import { Request, Response } from "express";
import { ProfileEdit } from "src/interface/IUser";
export interface IOrganiserController{
    getOrgById(req:Request,res:Response):Promise<void>
    checkStatus(req:Request<unknown,unknown,object>,res:Response):Promise<void>;
    updateOrganiser(req:Request<{organiserId:string},unknown,ProfileEdit>,res:Response):Promise<void>;
    fetchBooking(req:Request,res:Response):Promise<void>;
    getOrderDetails(req:Request,res:Response):Promise<void>;
}