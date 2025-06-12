import { Request, Response } from "express";
import { EditEvent } from "src/interface/event";
import { IEvent } from "src/model/event";
export interface IAdminEventController{
    getAllEvents(req:Request,res:Response):Promise<void>;
     eventEdit(req: Request<{id:string}, unknown,EditEvent>,  res: Response):Promise<void>;
      blockEvent(req: Request<unknown, unknown,IEvent>,  res: Response):Promise<void>
    
}