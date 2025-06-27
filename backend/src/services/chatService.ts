import { ChatResponse } from "src/interface/IChatResponse";
import { IChatService } from "./serviceInterface/IChatService";
import { IChatRepository } from "src/repositories/repositoryInterface/IChatRepository";

export class ChatService implements IChatService{
    constructor (private chatRepository:IChatRepository){}
    async chatCreate(message:string,userId:string):Promise<ChatResponse>{
        try {
            const result=await this.chatRepository.createChat(message,userId);
        if(result){
            return {success:true,message:"successfully chat",result:result.text}
        }else{
            return {success:false,message:"failed to chat"}
        } 
            
        } catch (error) {
            console.log(error);
            return {success:false,message:"failed to chat"}

            
            
        }
       


    }
}