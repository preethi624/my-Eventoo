import { MessageController } from "../controllers/messageController";
import { MessageRepository } from "../repositories/messageRepository";
import { MessageService } from "../services/messageService";
import { MongoClient } from "mongodb"
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eventDB";
const client = new MongoClient(MONGO_URI);




const messageRepository=new MessageRepository(client);
export const messageService=new MessageService(messageRepository);
export const messageController=new MessageController(messageService)
 
