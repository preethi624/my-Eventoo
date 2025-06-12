import { EventRepository } from "../repositories/eventRepository";
import { PaymentController } from "../controllers/paymentController";
import { PaymentRepository } from "../repositories/paymentRepository";
import { PaymentService } from "../services/paymentService";

const paymentRepository=new PaymentRepository();
const eventRepository=new EventRepository()
const paymentService=new PaymentService(paymentRepository,eventRepository);
export const paymentController=new PaymentController(paymentService)
