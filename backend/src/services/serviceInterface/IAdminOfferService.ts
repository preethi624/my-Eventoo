import { FormDataType, OfferFetch } from "src/interface/IOffer";
import { createVenue, VenueFilters} from "src/interface/IVenue";
import { IOffer } from "src/model/offer";


export interface IAdminOfferService{
 offerCreate(offerData:IOffer): Promise<createVenue>
 offersFetch(filters:VenueFilters):Promise<OfferFetch>
  offerDelete(offerId:string):Promise<{success:boolean}>
  offerEdit(offerId:string,data:FormDataType,file?: Express.Multer.File):Promise<IOffer|null>
}