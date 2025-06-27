
import { AdminVenueRepository } from "../repositories/adminVenueRepository";
import { AdminVenueService } from "../services/adminVenueService";
import { AdminVenueController } from "../controllers/adminVenueController";

const adminVenueRepository=new AdminVenueRepository();



const adminVenueService=new AdminVenueService(adminVenueRepository);
export const adminVenueController=new AdminVenueController(adminVenueService)
