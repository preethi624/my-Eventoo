
import { AdminOfferRepository } from "../repositories/adminOfferRepository";
import { AdminOfferService } from "../services/adminOfferService";
import { AdminOfferController } from "../controllers/adminOfferController";

const adminOfferRepository=new AdminOfferRepository();



const adminOfferService=new AdminOfferService(adminOfferRepository);
export const adminOfferController=new AdminOfferController(adminOfferService)
