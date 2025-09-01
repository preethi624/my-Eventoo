import { Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}