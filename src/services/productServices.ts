import { Response } from "express";
import { sequelize } from "../config/db";
import { CustomRequest } from "../customer/middlewares/sessionMiddleware";
import * as models from "../models/modelsRelations"

export const getProduct = async function (productID: number, options?: any): Promise<any> {
  try {
    const defaultOptions = {
      attributes: ["productID", "title", "subTitle", "price", "quantity", "discount"],
      include: [
        {
          model: models.imageModel,
          attributes: ["imgPath"],
          where: { position: 1 },
          required: false,
        },
      ],
    }

    const finalOptions = { ...defaultOptions, ...options }

    return await models.productModel.findByPk(productID, finalOptions);
  } catch (error) {
    throw error
  }
}

export async function updateProductQuantity(productID: number, newQuantity: number, transaction?: any): Promise<void> {
  try {
    await models.productModel.update(
      { quantity: newQuantity },
      {
        where: { productID },
        transaction: transaction
      }
    );
  } catch (error) {
    throw error
  }
}

export const getAllProducts = async (req: CustomRequest, res: Response, options: any): Promise<any> => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    let userID = req.user?.userID || null;

    return await models.productModel.findAll({
      where:options.where,
      attributes: [
        'productID',
        'title',
        'subTitle',
        'price',
        'discount',
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('ratings.rating')), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('ratings.rating')), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
        [sequelize.literal(`(SELECT COUNT(*) FROM wishList WHERE wishList.productID = products.productID AND wishList.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      include: [{
        model: models.ratingModel,
        attributes: [],
        as: 'ratings',
        required: false,
      }],
      group: ['productID'],
      offset: (page - 1) * pageSize,
      order: options.order,
      having: options.having,
      limit: pageSize,
      subQuery: false,
    }
    );

  } catch (error) {
    throw(error)
  }
}