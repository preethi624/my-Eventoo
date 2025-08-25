import { IReviewWithSentiment } from "src/interface/event";


export interface IReviewService{
    reviewCreate(review:{rating:number,comment:string},userId:string,eventId:string):Promise<{success:boolean,message:string}>;
    reviewsFetch(eventId:string):Promise<{success:boolean,reviews?:IReviewWithSentiment[]}>

}