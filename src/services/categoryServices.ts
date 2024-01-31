import { categoryModel } from "../models/category"
import { CustomError } from "./customError"

export async function findCategoryByName(categoryName: string): Promise<any> {
    try {
      return await categoryModel.findOne({
        where : {
            name : categoryName
        }
    })
    } catch (error) {
      throw new CustomError('Internal Server Error', 500)

    }
  }