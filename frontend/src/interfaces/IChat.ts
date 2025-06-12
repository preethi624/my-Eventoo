import type { ChatbotResponse } from "../assets/components/Chatbot";

export interface ChatResponse{
    success:boolean;
    message:string;
    response?:ChatbotResponse;
}