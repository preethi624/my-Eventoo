import { GeminiResponse } from "src/interface/IChatResponse";

export interface IChatRepository{
    createChat(prompt:string):Promise<GeminiResponse>
}