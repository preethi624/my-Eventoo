"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../container/middleware.di");
const reviewdi_1 = require("../container/reviewdi");
const router = express_1.default.Router();
router.post('/:eventId', middleware_di_1.authMiddlewarwSet.userOnly, reviewdi_1.reviewController.createReview.bind(reviewdi_1.reviewController));
router.get('/:eventId', middleware_di_1.authMiddlewarwSet.userAndOrganiser, reviewdi_1.reviewController.fetchReviews.bind(reviewdi_1.reviewController));
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map