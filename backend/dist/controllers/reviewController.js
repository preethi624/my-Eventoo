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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControoler = void 0;
class ReviewControoler {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const eventId = req.params.eventId;
            const review = req.body;
            try {
                if (!userId)
                    throw new Error("userId not found");
                const response = yield this._reviewService.reviewCreate(review, userId, eventId);
                if (response.success) {
                    res.json({ success: true, message: "successfully created review" });
                }
                else {
                    res.json({ success: false, message: "failed to create review" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.eventId;
            try {
                const response = yield this._reviewService.reviewsFetch(eventId);
                if (response.success) {
                    res.json({ success: true, reviews: response.reviews });
                }
                else {
                    res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.ReviewControoler = ReviewControoler;
//# sourceMappingURL=reviewController.js.map