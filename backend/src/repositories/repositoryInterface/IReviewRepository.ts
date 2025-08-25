import { IReview } from "src/model/review";

export interface IReviewRepository{
    createReview(review:{rating:number,comment:string},userId:string,eventId:string):Promise<IReview|undefined>
    fetchReviews(eventId:string):Promise<IReview[]|null>
}