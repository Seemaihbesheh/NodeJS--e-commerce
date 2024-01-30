import * as models from "../models/modelsRelations"



export const findRatings = async function (options?: any): Promise<any> {
    try {
      
      return await models.ratingModel.findAll({
        where : options.where,
        include: options.include,
        order: options.order
      });

    } catch (error) {
      throw error
    }
}

export const addRating = async function (newRating): Promise<any> {
    try {
      
      return await models.ratingModel.create(newRating);

    } catch (error) {
      throw error
    }
}

export const updateRating = async function (newRating , where): Promise<any> {
    try {
      
      return await models.ratingModel.update(newRating,{
        where: where
      });

    } catch (error) {
      throw error
    }
}