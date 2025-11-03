
import { IMessage, MessageModel } from "../model/message";
import { IMessageRepository } from "./repositoryInterface/IMessageRepository";
import { MongoClient, GridFSBucket,Db } from "mongodb"

export class MessageRepository implements IMessageRepository {
    private db: Db;
    constructor(client: MongoClient) {
    this.db = client.db("eventDB"); 
  }
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
  async saveFileToStorage(file: Express.Multer.File): Promise<string> {
    const bucket = new GridFSBucket(this.db, { bucketName: "files" });

    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(file.originalname);
      uploadStream.end(file.buffer);

      uploadStream.on("finish", () => {
      
        resolve(`/files/${uploadStream.id}`);
      });

      uploadStream.on("error", (err) => {
        reject(err);
      });
    });
  }
}
    