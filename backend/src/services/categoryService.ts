
import { ICategoryService } from "./serviceInterface/ICategoryService";
import { ICategoryRepository } from "src/repositories/repositoryInterface/ICategoryRepository";
import { GetCat } from "src/interface/ICat";

export class CategoryService implements ICategoryService {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async categoriesGet(): Promise<GetCat> {
    try {
      const response = await this._categoryRepository.getCategories();
      if (response) {
        return { cat: response, success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
}