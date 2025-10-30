import { EventRepository } from "../repositories/eventRepository";
import { PaymentController } from "../controllers/paymentController";
import { PaymentRepository } from "../repositories/paymentRepository";
import { PaymentService } from "../services/paymentService";
import { AdminOfferRepository } from "../repositories/adminOfferRepository";

const paymentRepository=new PaymentRepository();
const eventRepository=new EventRepository();
const offerRepository=new AdminOfferRepository()
const paymentService=new PaymentService(paymentRepository,eventRepository,offerRepository);
export const paymentController=new PaymentController(paymentService)
