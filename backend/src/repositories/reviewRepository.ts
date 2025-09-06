
import Review, { IReview } from "../model/review";
import { IReviewRepository } from "./repositoryInterface/IReviewRepository";

export class ReviewRepository implements IReviewRepository{
    async createReview(review:{rating:number,comment:string},userId:string,eventId:string):Promise<IReview|undefined>{
        
        try {
            const newReview=new Review({
                rating:review.rating,
                comment:review.comment,
                userId:userId,
                eventId:eventId


            });
            return await newReview.save()

            
        } catch (error) {
            console.log(error);
            return undefined
            
            
        }

    }
    async fetchReviews(eventId:string):Promise<IReview[]|null>{
        try {
            return await Review.find({eventId}).populate("userId","name prfileImage").lean()
            
        } catch (error) {
            console.log(error);
            return null
           
            
            
        }
    }
}