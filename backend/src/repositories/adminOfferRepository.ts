import { DeleteResult } from "mongoose";
import Offer, { IOffer } from "../model/offer";

import { IAdminOfferRepository } from "./repositoryInterface/IAdminOfferRepository";
import { FormDataType, OfferFetch } from "src/interface/IOffer";
import { VenueFilters } from "src/interface/IVenue";


export class AdminOfferRepository implements IAdminOfferRepository {
  async createOffer(offerData:IOffer): Promise<IOffer | null> {
    console.log("offerData", offerData);

    return await Offer.create(offerData);
  }
  async findOffer(offerCode:string):Promise<IOffer|null>{
    return await Offer.findOne({code:offerCode.toUpperCase()})
  }
  async updateOffer(offerId:string):Promise<IOffer|null>{
    return await Offer.findByIdAndUpdate(offerId,{$inc:{usedCount:1}},{new:true})
  }
  async fetchOffers(filters:VenueFilters):Promise<OfferFetch>{
    console.log("filters",filters);
    
    const skip =
      filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;
      const query =
     
        { title: { $regex: filters.searchTerm, $options: "i" } }
        
      
    
    const offers=await Offer.find(query).skip(skip)
      .limit(Number(filters.limit)).sort({createdAt:-1});
    const total = await Offer.countDocuments(query);
    console.log("total",total);
    
    return {
     offers,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
      currentPage: filters.page,
    };
   
    
   
  }
  async deleteOffer(offerId:string):Promise<DeleteResult>{
    return await Offer.deleteOne({_id:offerId})

  }
  async findById(offerId:string):Promise<IOffer|null>{
    return await Offer.findById(offerId)
  }
  async editOffer(offerId:string,data:FormDataType):Promise<IOffer|null>{
    return await Offer.findByIdAndUpdate(offerId,data,{new:true})

  }
  
}