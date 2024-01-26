import * as models from "../models/modelsRelations"
import { sequelize } from "../config/db"
import { CustomError } from './customError'

export const getSpecificOrder = async function (orderID: number): Promise<any>  {
    try {
        if (!orderID) {
            throw new CustomError('orderID is required', 404)
        }

        const orderExists = await models.orderModel.findOne({
            attributes: ['paymentMethod'],
            include: [
                {
                    model: models.addressModel,
                    attributes: ['street', 'state', 'city', 'pinCode'],
                },
                {
                    model: models.orderItemModel,
                    attributes: [
                        'productTitle',
                        'productSubtitle',
                        'productPrice',
                        'productQuantity',
                        'productDiscount',
                        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = orderitems.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
                    ],
                },
            ],
            where: {
                orderID: orderID,
            },
        })

        if (!orderExists) {
            throw new CustomError(`Order with orderID ${orderID} not found`, 404)
        }

        return orderExists
        
    } catch (error) {
        throw error
    }
}