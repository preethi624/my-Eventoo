"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
const categoryService_1 = require("../services/categoryService");
const categoryController_1 = require("../controllers/categoryController");
const categoryRepository = new categoryRepository_1.CategoryRepository();
const categoryService = new categoryService_1.CategoryService(categoryRepository);
exports.categoryController = new categoryController_1.CategoryController(categoryService);
//# sourceMappingURL=categorydi.js.map