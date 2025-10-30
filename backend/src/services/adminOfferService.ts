import {
  createVenue,
  VenueFilters,
  
} from "src/interface/IVenue";


import { MESSAGES } from "../constants/messages";
import { IAdminOfferService } from "./serviceInterface/IAdminOfferService";
import { IAdminOfferRepository } from "src/repositories/repositoryInterface/IAdminOfferRepository";
import { IOffer, IOfferImage } from "src/model/offer";
import { FormDataType, OfferFetch } from "src/interface/IOffer";

import cloudinary from "../config/cloudinary";

export class AdminOfferService implements IAdminOfferService {
  constructor(private _adminOfferRepository: IAdminOfferRepository) {}
  async offerCreate(offerData:IOffer): Promise<createVenue> {
    try {
      const result = await this._adminOfferRepository.createOffer(offerData);

      if (result) {
        return { success: true, message: MESSAGES.EVENT.SUCCESS_TO_CREATE };
      } else {
        return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
    }
  }
  async offersFetch(filters:VenueFilters):Promise<OfferFetch>{
    try {
      const response=await this._adminOfferRepository.fetchOffers(filters);
      console.log("response",response);
      
      if(response){
         return {
          success: true,
          message: MESSAGES.EVENT.SUCCESS_TO_FETCH,
          offers: response.offers,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        };
      }else{
        return{success:false}
      }
      
    } catch (error) {
      console.error(error);
      return { success: false, message: MESSAGES.EVENT.FAILED_TO_CREATE };
    }
  }
  async offerDelete(offerId:string):Promise<{success:boolean}>{
    try {
      const response=await this._adminOfferRepository.deleteOffer(offerId);
      if(response){
        return{success:true}
      }else{
        return{success:false}
      }

      
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async offerEdit(offerId:string,data:FormDataType,file?: Express.Multer.File):Promise<IOffer|null>{
    const existingOffer = await this._adminOfferRepository.findById(offerId);
      if (!existingOffer) {
        throw new Error("Event not found");
      }
    
      let normalizedImages: IOfferImage[] = [];
    
      if (file) {
        
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "offers"
        });
    
       
        normalizedImages = [
          {
            url: result.secure_url,
            public_id: result.public_id || null,
          },
        ];
      } else {
       
        normalizedImages = (existingOffer.images as (string | IOfferImage)[]).map((img) => ({
          url: typeof img === "string" ? img : img.url,
          public_id: typeof img === "string" ? null : img.public_id ?? null,
        }));
      }
    
     
      data.images = normalizedImages;
    
      
      const updatedEvent = await this._adminOfferRepository.editOffer(offerId, data);
      return updatedEvent;
  }
  
}
