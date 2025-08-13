import { MessageController } from "../controllers/messageController";
import { MessageRepository } from "../repositories/messageRepository";
import { MessageService } from "../services/messageService";

const messageRepository=new MessageRepository();
export const messageService=new MessageService(messageRepository);
export const messageController=new MessageController(messageService)
 
