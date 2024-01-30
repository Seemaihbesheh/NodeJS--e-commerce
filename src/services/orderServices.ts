import * as models from "../models/modelsRelations"
import { sequelize } from "../config/db"
import { CustomError } from './customError'
import { Op } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

export const getUserOrdersByStatus = async function (userID:number, status: string, page: number, pageSize: number): Promise<any> {
  try {

    const orders = await models.orderModel.findAll({
      attributes: ['displayID', 'date', 'grandTotal', 'isPaid'],
      where: {
        userID: userID,
        status: status
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    if (!orders) {
      throw new CustomError('No Orders were found', 404)
    }

    return orders

  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const getSpecificOrder = async function (orderID: number): Promise<any> {
  try {
    if (!orderID) {
      throw new CustomError('orderID is required', 404)
    }

    const orderExists = await models.orderModel.findOne({
      attributes: ['paymentMethod', 'displayID', 'status'],
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
            'subTotal',
            [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = orderitems.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
          ],
        },
      ],
      where: {
        orderID: orderID,
      },
    })

    if (!orderExists) {
      throw new CustomError(`Order with this orderID not found`, 404)
    }

    return orderExists

  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const updateOrderStatus = async function (orderID: number, newStatus: string): Promise<any> {
  try {
    const [updatedRowsCount, [updatedOrder]] = await models.orderModel.update(
      { status: newStatus },
      { where: { orderID: orderID, status: { [Op.notIn]: ['completed', 'cancelled'] } }, returning: true },

    )

    if (updatedRowsCount === 0) {
      throw new CustomError('Order status cannot be updated', 400)
    }
    return updatedOrder

  } catch (error) {

    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const getProcessingOrders = async function (): Promise<any> {
  try {
    const processingOrders = await models.orderModel.findAll({
      where: {
        status: 'processing',
      },
    })

    return (processingOrders)

  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const createOrder = async function createOrder(orderData: any, transaction?: any): Promise<any> {
  try {
    return await models.orderModel.create(
      {
        ...orderData,
        status: 'processing',
        date: new Date(),
        displayID: parseInt(uuidv4().replace(/-/g, ''), 10),
      },
      { transaction }
    );
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const createOrderItem = async function createOrderItem(element: any, orderID: number, transaction?: any): Promise<any> {
  try {
    return await models.orderItemModel.create(
      {
        ...element,
        orderID,
      },
      { transaction }
    )
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}