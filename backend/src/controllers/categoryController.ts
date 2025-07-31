import { ICategoryService } from "src/services/serviceInterface/ICategoryService";
import { ICategoryController } from "./controllerInterface/ICategoryController";
import { Request, Response } from 'express';

export class CategoryController implements ICategoryController{
      constructor(private categoryService:ICategoryService){}
      async getCategories(req:Request,res:Response):Promise<void>{
        try {
            const result=await this.categoryService.categoriesGet();
            if(result.success){
                res.json({cat:result.cat})
            }else{
                res.json({success:false})
            }
            
            
        } catch (error) {
            console.log(error)
            
        }



      }


     
}