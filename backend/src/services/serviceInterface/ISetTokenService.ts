import { Response } from "express"
export interface ISetTokenService{
    setRefreshToken(res: Response, token: string):void;

}