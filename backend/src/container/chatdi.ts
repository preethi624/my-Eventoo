import { ChatController } from "../controllers/chatController";
import { ChatRepository } from "../repositories/chatRepository";
import { ChatService } from "../services/chatService";

const chatRepository=new ChatRepository();
const chatService=new ChatService(chatRepository);
export const chatController=new ChatController(chatService)