"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const inference_1 = require("@huggingface/inference");
const hf = new inference_1.InferenceClient(process.env.HUGGING_API_KEY);
dotenv_1.default.config();
function analyzeSentiment(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield hf.textClassification({
            model: "distilbert-base-uncased-finetuned-sst-2-english", // Good model for sentiment
            inputs: text,
        });
        return result;
    });
}
class ReviewService {
    constructor(_reviewRepository) {
        this._reviewRepository = _reviewRepository;
    }
    reviewCreate(review, userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._reviewRepository.createReview(review, userId, eventId);
                if (response) {
                    return { success: true, message: "successfully created review" };
                }
                else {
                    return { success: false, message: "failed to create" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed" };
            }
        });
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
    reviewsFetch(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._reviewRepository.fetchReviews(eventId);
                if (!response) {
                    return { success: false };
                }
                const analysedReviews = yield Promise.all(response.map((review) => __awaiter(this, void 0, void 0, function* () {
                    const plainReview = {
                        _id: review._id.toString(),
                        userId: review.userId.name, // string
                        eventId: review.eventId.toString(),
                        rating: review.rating,
                        comment: review.comment,
                        createdAt: review.createdAt,
                        sentiment: "UNKNOWN",
                    };
                    try {
                        const result = yield analyzeSentiment(plainReview.comment);
                        // result looks like: [ { label: "POSITIVE", score: 0.99 } ]
                        if (result && result.length > 0) {
                            plainReview.sentiment = result[0].label;
                        }
                    }
                    catch (error) {
                        console.error("Sentiment analysis failed:", error);
                    }
                    return plainReview;
                })));
                return { success: true, reviews: analysedReviews };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=reviewService.js.map