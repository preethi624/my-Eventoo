import { IMessage } from "src/model/message";

export interface IMessageRepository{
    saveMessage(senderId:string,receiverId:string,message:string,isOrganiser:boolean):Promise<IMessage>;
     getMessages(senderId:string,receiverId:string):Promise<IMessage[]>
      saveFileToStorage(file: Express.Multer.File): Promise<string>

}