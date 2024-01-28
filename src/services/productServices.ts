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