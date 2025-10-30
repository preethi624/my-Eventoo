import { IOffer } from "src/model/offer";
import { IOfferService } from "./serviceInterface/IOfferService";
import { IOfferRepository } from "src/repositories/repositoryInterface/IOfferReposittory";
import { OfferFilters } from "src/interface/IVenue";
import { OfferFetch } from "src/interface/IOffer";


export class OfferService implements IOfferService {
  constructor(private _offerRepository: IOfferRepository) {}
  async offersGet(filters:OfferFilters): Promise<OfferFetch> {
    try {
      const result = await this._offerRepository.getOffers(filters)

      if (result) {
        return { offers: result.offers, success: true,totalPages:result.totalPages,currentPage:result.currentPage};
      } else {
        return { success: false};
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
  async offerDetailsGet(offerId:string):Promise<{success:boolean,offers?:IOffer}>{
    try {
      const result=await this._offerRepository.getOfferDetails(offerId);
      if(result){
        return{success:true,offers:result}
      }else{
        return{success:false}
      }
      
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
}