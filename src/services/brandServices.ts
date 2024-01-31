import { brandModel } from "../models/brand"
import { CustomError } from "./customError"

export async function findBrandByName(brandName: string): Promise<any> {
    try {
      return await brandModel.findOne({
        where : {
            name : brandName
        }
    })
    } catch (error) {
      throw new CustomError('Internal Server Error', 500)
    }
  }