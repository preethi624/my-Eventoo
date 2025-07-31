import { CategoryRepository } from "../repositories/categoryRepository";

import { CategoryService } from "../services/categoryService";
import { CategoryController } from "../controllers/categoryController";

const categoryRepository=new CategoryRepository();

const categoryService=new CategoryService(categoryRepository);
export const categoryController=new CategoryController(categoryService)
