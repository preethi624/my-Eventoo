import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeEnum";



import { MESSAGES } from "../constants/messages";
import { IAdminOfferController } from "./controllerInterface/IAdminOfferController";
import { IAdminOfferService } from "src/services/serviceInterface/IAdminOfferService";
import { ParsedQs } from "qs";
export class AdminOfferController implements IAdminOfferController {
  constructor(private _adminOfferService: IAdminOfferService) {}
  async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
     
    
      const offerData = {
        ...req.body,
        images: files?.map((file: Express.Multer.File) => ({
          url:file.path,
          public_id:file.filename
        })) || [],
       
      };
      console.log("venue", offerData);

      const response = await this._adminOfferService.offerCreate(offerData);
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
  async fetchOffers(req:Request,res:Response):Promise<void>{
    try {
       const query = req.query as ParsedQs;
            const filters= {
              searchTerm:
                typeof query.searchTerm === "string" ? query.searchTerm : "",
      
              page: query.page ? Number(query.page) : undefined,
              limit:
                query.limit && !isNaN(Number(query.limit))
                  ? Number(query.limit)
                  : undefined,
            };
      const response=await this._adminOfferService.offersFetch(filters);
      if(response.success){
       res.json({
                 successs: true,
                 message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
                 offers: response.offers,
                 totalPages: response.totalPages,
                 currentPage: response.currentPage,
               });
      }else{
        res.json({success:false})
      }
      
    } catch (error) {
      console.log(error);
      
      
    }

  }
  async deleteOffer(req:Request,res:Response):Promise<void>{
    try {
      const offerId=req.params.offerId;
      const response=await this._adminOfferService.offerDelete(offerId);
      if(response.success){
        res.json({success:true})
      }else{
        res.json({success:false})
      }
      
    } catch (error) {
      console.log(error);
      
      
    }

  }
  async editOffer(req:Request,res:Response):Promise<void>{
    try {
      const offerId=req.params.offerId;
      const data=req.body;
       const file = req.file as Express.Multer.File | undefined;
       const response=await this._adminOfferService.offerEdit(offerId,data,file);
       if (response) {
      res.json({ success: true, message: MESSAGES.EVENT.SUCCESS_TO_UPDATE });
    } else {
      res.json({ success: false, message: MESSAGES.EVENT.FAILED_TO_UPDATE });
    }


      
    } catch (error) {
      console.error(error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.EVENT.FAILED_TO_UPDATE,
    });
      
    }

  }
  
}
