import * as models from "../models/modelsRelations"

export const getProduct = async (productID: number) => {
    try {
        return await models.productModel.findByPk(productID, {
            attributes: ["productID", "title", "subTitle", "price", "quantity", "discount"],
            include: [
                {
                    model: models.imageModel,
                    attributes: ["imgPath"],
                    where: { position: 1 },
                    required: false,
                },
            ],
        })
    } catch (error) {
        throw new Error('Internal Server Error')
    }
}