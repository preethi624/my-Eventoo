import { MessagesGet } from "src/interface/IMessage";
import { IMessage } from "src/model/message";

export interface IMessageService{
     handleIncomingMessage(senderId:string,receiverId:string,message:string,isOrganiser:boolean):Promise<IMessage>;
      messagesGet(orgId:string,userId:string):Promise<MessagesGet>
      postMessage(file: Express.Multer.File):Promise<{fileUrl:string}>


}