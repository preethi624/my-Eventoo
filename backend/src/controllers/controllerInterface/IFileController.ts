export interface IFileController{
    getFile(req: Request, res: Response): Promise<void>


}