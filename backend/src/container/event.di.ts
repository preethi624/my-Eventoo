import { EventController } from "../controllers/eventController";
import { EventRepository } from "../repositories/eventRepository";
import { EventService } from "../services/eventService";

const eventRepository=new EventRepository();

const eventService=new EventService(eventRepository);
export const eventController=new EventController(eventService)//in event di
