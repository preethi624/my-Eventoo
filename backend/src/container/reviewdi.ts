import { ReviewControoler } from "../controllers/reviewController";
import { ReviewRepository } from "../repositories/reviewRepository";
import { ReviewService } from "../services/reviewService";


const reviewRepository=new ReviewRepository();
const reviewService=new ReviewService(reviewRepository);
export const reviewController=new ReviewControoler(reviewService)