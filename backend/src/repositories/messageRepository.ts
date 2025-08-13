
import { IMessage, MessageModel } from "../model/message";
import { IMessageRepository } from "./repositoryInterface/IMessageRepository";

export class MessageRepository implements IMessageRepository {
  async saveMessage(
    senderId: string,
    receiverId: string,
    message: string,
    isOrganiser: boolean
  ): Promise<IMessage> {
    return await MessageModel.create({
      senderId,
      receiverId,
      message,
      isOrganiser,
      timestamp: new Date(),
    });
  }
  async getMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });
  }
}
    