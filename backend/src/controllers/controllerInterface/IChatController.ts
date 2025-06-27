import { Request, Response } from "express";
export interface IChatController{
    createChat(req:Request<unknown,unknown,{message:string,userId:string}>,res:Response):Promise<void>
}