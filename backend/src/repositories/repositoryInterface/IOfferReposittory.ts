import { OfferFetch } from "src/interface/IOffer";
import { OfferFilters } from "src/interface/IVenue";
import { IOffer } from "src/model/offer";

export interface IOfferRepository{
 getOffers(filters:OfferFilters): Promise<OfferFetch>
    getOfferDetails(offerId:string):Promise<IOffer|null>
}