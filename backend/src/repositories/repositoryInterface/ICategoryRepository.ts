
import { ICategory } from "src/model/category";

export interface ICategoryRepository{
    getCategories():Promise<ICategory[]>


}