import { ChatResponse } from "src/interface/IChatResponse";

export interface IChatService{
    chatCreate(message:string):Promise<ChatResponse>
}