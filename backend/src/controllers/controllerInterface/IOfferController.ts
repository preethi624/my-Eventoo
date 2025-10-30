import { Request, Response } from "express";
export interface IOfferController{
    getOffers(req:Request,res:Response):Promise<void>
    getOfferDetails(req:Request,res:Response):Promise<void>
}