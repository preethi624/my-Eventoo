import { IMessage } from "src/model/message";
import { IMessageRepository } from "src/repositories/repositoryInterface/IMessageRepository";
import { IMessageService } from "./serviceInterface/IMessageService";
import { MessagesGet } from "src/interface/IMessage";

export class MessageService implements IMessageService {
  constructor(private _messageRepository: IMessageRepository) {}
  async handleIncomingMessage(
    senderId: string,
    receiverId: string,
    message: string,
    isOrganiser: boolean
  ): Promise<IMessage> {
    const savedMessage = await this._messageRepository.saveMessage(
      senderId,
      receiverId,
      message,
      isOrganiser
    );
    return savedMessage;
  }
  async messagesGet(orgId: string, userId: string): Promise<MessagesGet> {
    try {
      const response = await this._messageRepository.getMessages(orgId, userId);
      if (response) {
        return { messages: response, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
  async postMessage(file: Express.Multer.File):Promise<{fileUrl:string}> {
    
    const fileUrl = await this._messageRepository.saveFileToStorage(file);
    return { fileUrl };
  }
}
