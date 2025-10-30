import { OfferRepository } from "../repositories/offerRepository";

import { OfferService } from "../services/offerService";
import { OfferController } from "../controllers/offerController";


const offerRepository=new OfferRepository();
const offerService=new OfferService(offerRepository);
export const offerController=new OfferController(offerService)