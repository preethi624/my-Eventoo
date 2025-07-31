import Category, { ICategory } from "../model/category"
import { ICategoryRepository } from "./repositoryInterface/ICategoryRepository"



export class CategoryRepository implements ICategoryRepository{
    async getCategories():Promise<ICategory[]>{
        return await Category.find()
    }

}