import { Request, Response } from "express";

import { IChatController } from "./controllerInterface/IChatController";
import { IChatService } from "src/services/serviceInterface/IChatService";
import { StatusCode } from "../constants/statusCodeEnum";
import { MESSAGES } from "../constants/messages";
export class ChatController implements IChatController {
  constructor(private _chatService: IChatService) {}
  async createChat(
    req: Request<unknown, unknown, { message: string; userId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { message, userId } = req.body;
      const response = await this._chatService.chatCreate(message, userId);
      if (response.success) {
        res.json({
          success: true,
          message: MESSAGES.CHAT.SUCCESS_CHAT,
          response: response.result,
        });
      } else {
        res.json({ success: false, message: MESSAGES.CHAT.FAILED_CHAT });
      }
    } catch (error) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.CHAT.FAILED_CHAT,
      });
    }
  }
}
