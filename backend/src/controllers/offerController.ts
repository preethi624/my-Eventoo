import { Request, Response } from "express";
import { IOfferController } from "./controllerInterface/IOfferController";
import { IOfferService } from "src/services/serviceInterface/IOfferService";
import { ParsedQs } from "qs";
export class OfferController implements IOfferController{
    constructor(private _offerService:IOfferService){}
    async getOffers(req:Request,res:Response):Promise<void>{
        try {
            const query = req.query as ParsedQs;
                        const filters= {
                          selectedType:
                            typeof query.selectedType=== "string" ? query.selectedType: "",
                            selectedMinAmount:typeof query.selectedMinAmount=== "string" ? Number(query.selectedMinAmount): 0,
                  
                          page: query.page ? Number(query.page) : undefined,
                          limit:
                            query.limit && !isNaN(Number(query.limit))
                              ? Number(query.limit)
                              : undefined,
                        };
            const response=await this._offerService.offersGet(filters);
            if(response.success){
                res.json({success:true,offers:response.offers,totalPages:response.totalPages,currentPage:response.currentPage})
            }
            
        } catch (error) {
            console.log(error);
            
        }

    }
    async getOfferDetails(req:Request,res:Response):Promise<void>{
        try {
            const offerId=req.params.offerId;
            const response=await this._offerService.offerDetailsGet(offerId);
            if(response.success){
                res.json({success:true,offers:response.offers})
            }else{
                res.json({success:false})
            }
            
        } catch (error) {
            console.log(error);
            
            
        }

    }
}