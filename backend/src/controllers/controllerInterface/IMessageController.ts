export interface IMessageController{
    getMessages(req:Request,res:Response):Promise<void>
    postMessages(req:Request,res:Response):Promise<void>
       
    
}