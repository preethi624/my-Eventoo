import { Request, Response } from "express";
import { EventEdit } from "src/interface/event";
import { IEventDTO } from "src/interface/IEventDTO";
export interface IEventController{
    getEvents(req: Request, res: Response): Promise<void>;
    getEventById(req:Request, res:Response):Promise<void>;
    createEvent(req: Request<unknown, unknown, IEventDTO>, res: Response):Promise<void>;
    deleteEvent(req: Request, res: Response):Promise<void>;
    editEvent(req: Request<{id:string}, unknown, EventEdit>, res: Response):Promise<void>;
     eventGet(req:Request, res:Response):Promise<void>;
      getDashboardEvents(req:Request,res:Response):Promise<void>
    

}