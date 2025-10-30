import { OfferFilters } from "src/interface/IVenue";
import Offer, { IOffer } from "../model/offer";
import { IOfferRepository } from "./repositoryInterface/IOfferReposittory";
import { FilterQuery } from "mongoose";
import { OfferFetch } from "src/interface/IOffer";

export class OfferRepository implements IOfferRepository {
  async getOffers(filters:OfferFilters): Promise<OfferFetch> {
    const now = new Date();
   
      const query: FilterQuery<IOffer> = {
      endDate: { $gte: now }, 
    };
     if (filters.selectedType) {
      query.discountType = filters.selectedType;
    }

    if (filters.selectedMinAmount) {
      query.minOrderAmount = { $lte: filters.selectedMinAmount };
    }

   
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    // ⚙️ Execute query with pagination
    const offers = await Offer.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      const total=await Offer.countDocuments(query)

   return {
     offers,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0,
      currentPage: filters.page,
    };
   
  }
  async getOfferDetails(offerId:string):Promise<IOffer|null>{
    return await Offer.findById(offerId)
  }
}