import { IMessage } from "src/model/message";

export interface MessagesGet{
    success?:boolean;
    messages?:IMessage[]
}