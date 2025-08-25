"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const reviewController_1 = require("../controllers/reviewController");
const reviewRepository_1 = require("../repositories/reviewRepository");
const reviewService_1 = require("../services/reviewService");
const reviewRepository = new reviewRepository_1.ReviewRepository();
const reviewService = new reviewService_1.ReviewService(reviewRepository);
exports.reviewController = new reviewController_1.ReviewControoler(reviewService);
//# sourceMappingURL=reviewdi.js.map