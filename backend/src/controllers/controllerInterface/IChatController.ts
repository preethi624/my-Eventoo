import { Request, Response } from "express";
export interface IChatController{
    createChat(req:Request<unknown,unknown,string>,res:Response):Promise<void>
}