import { Request, Response } from "express";
import { IReviewController } from "./controllerInterface/IReviewController";
import { IReviewService } from "src/services/serviceInterface/IReviewService";
import { AuthenticatedRequest } from "src/interface/AuthenticatedRequest";

export class ReviewControoler implements IReviewController {
  constructor(private _reviewService: IReviewService) {}
  async createReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const eventId = req.params.eventId;
    const review = req.body;
    try {
      if (!userId) throw new Error("userId not found");
      const response = await this._reviewService.reviewCreate(
        review,
        userId,
        eventId
      );
      if (response.success) {
        res.json({ success: true, message: "successfully created review" });
      } else {
        res.json({ success: false, message: "failed to create review" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async fetchReviews(req: Request, res: Response): Promise<void> {
    const eventId = req.params.eventId;
    try {
      const response = await this._reviewService.reviewsFetch(eventId);
      if (response.success) {
        res.json({ success: true, reviews: response.reviews });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
