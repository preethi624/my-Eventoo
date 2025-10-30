
import { DeleteResult } from "mongoose";
import { FormDataType, OfferFetch } from "src/interface/IOffer";
import { VenueFilters } from "src/interface/IVenue";
import { IOffer } from "src/model/offer";



export interface IAdminOfferRepository {
    createOffer(offerData:IOffer): Promise<IOffer | null>
    findOffer(offerCode:string):Promise<IOffer|null>
    updateOffer(offerId:string):Promise<IOffer|null>
 fetchOffers(filters:VenueFilters):Promise<OfferFetch>
   deleteOffer(offerId:string):Promise<DeleteResult>
   findById(offerId:string):Promise<IOffer|null>
   editOffer(offerId:string,data:FormDataType):Promise<IOffer|null>
}