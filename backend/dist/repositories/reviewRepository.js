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
exports.ReviewRepository = void 0;
const review_1 = __importDefault(require("../model/review"));
class ReviewRepository {
    createReview(review, userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReview = new review_1.default({
                    rating: review.rating,
                    comment: review.comment,
                    userId: userId,
                    eventId: eventId
                });
                return yield newReview.save();
            }
            catch (error) {
                console.log(error);
                return undefined;
            }
        });
    }
    fetchReviews(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield review_1.default.find({ eventId }).populate("userId", "name prfileImage").lean();
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=reviewRepository.js.map