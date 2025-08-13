"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categorydi_1 = require("../container/categorydi");
const middleware_di_1 = require("../container/middleware.di");
const router = express_1.default.Router();
router.get("/categories", middleware_di_1.authMiddlewarwSet.userAndOrganiser, categorydi_1.categoryController.getCategories.bind(categorydi_1.categoryController));
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map