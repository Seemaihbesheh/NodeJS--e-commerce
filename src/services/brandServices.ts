import { brandModel } from "../models/brand"


export async function findBrandByName(brandName: string): Promise<any> {
    try {
      return await brandModel.findOne({
        where : {
            name : brandName
        }
    })
    } catch (error) {
      throw error
    }
  }