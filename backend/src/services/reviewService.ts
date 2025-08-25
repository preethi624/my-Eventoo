import { IReviewRepository } from "src/repositories/repositoryInterface/IReviewRepository";
import { IReviewService } from "./serviceInterface/IReviewService";
import { IReview } from "src/model/review";
import axios from "axios";
import dotenv from 'dotenv';
import { IReviewWithSentiment } from "src/interface/event";
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGING_API_KEY);

dotenv.config()
async function analyzeSentiment(text:string) {
  const result = await hf.textClassification({
    model: "distilbert-base-uncased-finetuned-sst-2-english", // Good model for sentiment
    inputs: text,
  });

  return result

}


export class ReviewService implements IReviewService{
    constructor(private _reviewRepository:IReviewRepository){}
    async reviewCreate(review:{rating:number,comment:string},userId:string,eventId:string):Promise<{success:boolean,message:string}>{
        try {
              const response=await this._reviewRepository.createReview(review,userId,eventId);
              
        if(response){
            return {success:true,message:"successfully created review"}
        }else{
            return {success:false,message:"failed to create"}
        }
            
        } catch (error) {
            console.log(error);
            
            return{success:false,message:"failed"}
            
        }
      
    }
    /*async reviewsFetch(eventId:string):Promise<{success:boolean,reviews?:IReviewWithSentiment[]}>{
        try {
            const response=await this._reviewRepository.fetchReviews(eventId);
            /*if(response){
                return {success:true,reviews:response}
            }else{
                return{success:false}
            }
           if(!response){
                return {success:false}
              }
              const analysedReviews = await Promise.all(
  response.map(async (review) => {
    const plainReview: IReviewWithSentiment = {
      _id: review._id!.toString(),
      userId: (review.userId as any).name, // string
      eventId: review.eventId.toString(),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      sentiment: "UNKNOWN",
    };

   /* try {
      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        { inputs: plainReview.comment },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("hf res",hfResponse);
      

      plainReview.sentiment = hfResponse.data[0][0].label;
    } catch (error) {
      console.error("HF API error:", error);
      
    }
  analyzeSentiment(plainReview.comment)

    
  })
  
);
return { success: true, reviews: analysedReviews };

        } catch (error) {
           console.log(error);
           return {success:false}
           
            
            
        }
    }*/
   async reviewsFetch(
  eventId: string
): Promise<{ success: boolean; reviews?: IReviewWithSentiment[] }> {
  try {
    const response = await this._reviewRepository.fetchReviews(eventId);

    if (!response) {
      return { success: false };
    }

    const analysedReviews = await Promise.all(
      response.map(async (review) => {
        const plainReview: IReviewWithSentiment = {
          _id: review._id!.toString(),
          userId: (review.userId as any).name, // string
          eventId: review.eventId.toString(),
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          sentiment: "UNKNOWN",
        };

        try {
          const result = await analyzeSentiment(plainReview.comment);

          // result looks like: [ { label: "POSITIVE", score: 0.99 } ]
          if (result && result.length > 0) {
            plainReview.sentiment = result[0].label;
          }
        } catch (error) {
          console.error("Sentiment analysis failed:", error);
        }

        return plainReview;
      })
    );

    return { success: true, reviews: analysedReviews };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
}