import { GetCat } from "src/interface/ICat";


export interface ICategoryService{
   categoriesGet():Promise<GetCat> 
}