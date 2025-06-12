import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv';
import { GeminiResponse } from "src/interface/IChatResponse";
import { IChatRepository } from "./repositoryInterface/IChatRepository";
dotenv.config()
const ai=new GoogleGenerativeAI(

process.env.GEMINI_API_KEY||'',
)
export class ChatRepository implements IChatRepository{
    async createChat(prompt:string|object):Promise<GeminiResponse>{
        try {
          
          const promptString = typeof prompt === "string" ? prompt : JSON.stringify(prompt);
            
           
            const model=ai.getGenerativeModel({model:"gemini-1.5-flash"});
            const result=await model.generateContent({contents:[
                 {
          role: "user",
          parts: [
            { text: promptString }
          ]
        }
            ]});
            const responseText =result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            
            return {
                text:responseText
            }
            
        } catch (error) {
            console.error("Error generating Gemini response:", error);
            if (typeof error === "object" && error !== null && "status" in error) {
            if (error.status === 429) {
      console.warn("Gemini API quota exceeded. Please try again later.");
      return { text: "I'm currently experiencing a high volume of requests. Please try again in a minute!" };
    }
  }
           throw new Error("Failed to generate response");
            
        }

    }



}