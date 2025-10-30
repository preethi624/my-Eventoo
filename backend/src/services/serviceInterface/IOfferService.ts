import { OfferFetch } from "src/interface/IOffer";
import { OfferFilters } from "src/interface/IVenue";
import { IOffer } from "src/model/offer";

export interface IOfferService{
   offersGet(filters:OfferFilters): Promise<OfferFetch> 
   offerDetailsGet(offerId:string):Promise<{success:boolean,offers?:IOffer}>
}