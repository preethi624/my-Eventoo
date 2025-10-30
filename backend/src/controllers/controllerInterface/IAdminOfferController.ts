import { Request, Response } from "express";
export interface IAdminOfferController{
    createOffer(req:Request,res:Response):Promise<void>
    fetchOffers(req:Request,res:Response):Promise<void>
    deleteOffer(req:Request,res:Response):Promise<void>
    editOffer(req:Request,res:Response):Promise<void>
}