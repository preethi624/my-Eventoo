import { ChatResponse } from "src/interface/IChatResponse";
import { IChatService } from "./serviceInterface/IChatService";
import { IChatRepository } from "src/repositories/repositoryInterface/IChatRepository";
import { MESSAGES } from "../constants/messages";

export class ChatService implements IChatService {
  constructor(private _chatRepository: IChatRepository) {}
  async chatCreate(message: string, userId: string): Promise<ChatResponse> {
    try {
      const result = await this._chatRepository.createChat(message, userId);
      if (result) {
        return {
          success: true,
          message: MESSAGES.CHAT.SUCCESS_CHAT,
          result: result.text,
        };
      } else {
        return { success: false, message: MESSAGES.CHAT.FAILED_CHAT };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: MESSAGES.CHAT.FAILED_CHAT };
    }
  }
}
