import { Request, Response } from "express";
export interface IAdminVenueController{
    createVenue(req:Request,res:Response):Promise<void>
    fetchVenues(req:Request,res:Response):Promise<void>;
    editVenue(req:Request,res:Response):Promise<void>;
    deleteVenue(req:Request,res:Response):Promise<void>
}