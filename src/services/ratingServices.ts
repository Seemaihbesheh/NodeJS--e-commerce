import * as models from "../models/modelsRelations"
import {CustomError} from './customError'


export const findRatings = async function (options?: any): Promise<any> {
    try {
      
      return await models.ratingModel.findAll({
        where : options.where,
        include: options.include,
        order: options.order
      });

    } catch (error) {
      throw new CustomError('Internal Server Error', 500)
    }
}

export const addRating = async function (newRating): Promise<any> {
    try {
      
      return await models.ratingModel.create(newRating);

    } catch (error) {
      throw new CustomError('Internal Server Error', 500)
    }
}

export const updateRating = async function (newRating , where): Promise<any> {
    try {
      
      return await models.ratingModel.update(newRating,{
        where: where
      });

    } catch (error) {
      throw new CustomError('Internal Server Error', 500)
    }
}