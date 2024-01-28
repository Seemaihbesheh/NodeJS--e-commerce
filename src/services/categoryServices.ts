import { categoryModel } from "../models/category"


export async function findCategoryByName(categoryName: string): Promise<any> {
    try {
      return await categoryModel.findOne({
        where : {
            name : categoryName
        }
    })
    } catch (error) {
      throw error
    }
  }