import { sequelize } from "../../config/db"
import { Request, Response } from 'express'
import * as orderSevices from '../../services/orderServices'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as cartServices from '../../services/cartServices'
import * as productSevices from '../../services/productServices'
import * as addressServices from '../../services/addressServices'

export const getOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const status = req.query.status as string
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10



    const orders = await orderSevices.getOrdersByStatus(status, page, pageSize)
    const count = orders.length

    return res.status(200).json({ "count": count, "orders": orders })

  } catch (error) {
    res.status(error.status).json(error.message)
  }

}

export const getSpecificOrder = async function (req: Request, res: Response): Promise<any> {
  try {
    const orderID = Number(req.query.orderID)
    const orderDetails = await orderSevices.getSpecificOrder(orderID)
    res.status(200).json(orderDetails)

  } catch (error) {
    console.error(error)
    res.status(error.status).json(error.message)
  }
}

export const placeOrder = async function (req: CustomRequest, res: Response): Promise<any> {

  const transaction = await sequelize.transaction()

  try {
    const userID = req.user.userID
    let isPaid = true

    const { street, state, city, pinCode } = req.body
    const existingAddress = await addressServices.findAddress({ userID, street, state, city, pinCode })
    let addressID = existingAddress.addressID

    if (!existingAddress) {
      const newAddress = await addressServices.createAddress({
        userID,
        street,
        state,
        city,
        pinCode,
      }, transaction)
      addressID = newAddress.addressID
    }

    const email = req.user.email
    const { fullName, mobile, paymentMethod } = req.body

    const orderItems = req.body.orderItems
    let grandTotal = 0

    await Promise.all(orderItems.map(async (element) => {
      const productExist = await productSevices.getProduct(element.productID, {
        transaction: transaction,
        lock: true
      })
      if (!productExist) return res.status(400).send(`product doesn't exist`)

      element.productPrice = productExist.price,
        element.productTitle = productExist.title,
        element.productSubtitle = productExist.subTitle,
        element.productDiscount = productExist.discount,
        element.subTotal = (productExist.price * (1 - productExist.discount / 100) * element.productQuantity),
        element.productQuantity = element.productQuantity

      grandTotal += element.subTotal
    }))

    if (paymentMethod === 'cash On Delivery') isPaid = false

    const newOrder = await orderSevices.createOrder({
      fullName,
      mobile,
      userID,
      email,
      paymentMethod,
      isPaid,
      state,
      street,
      city,
      pinCode,
      grandTotal,
    }, transaction)
    const orderID = newOrder.orderID

    await Promise.all(orderItems.map(async (element) => {
      await orderSevices.createOrderItem(element, orderID, transaction)
      let productID = element.productID
      let newQuantity = this.quantity - element.productQuantity
      await productSevices.updateProductQuantity(productID, newQuantity, transaction)
      await cartServices.updateProductInCart(productID, userID, { isOrdered: true }, transaction)

    }))
    await transaction.commit()
    return res.status(201)

  } catch (error) {
    await transaction.rollback()
    return res.status(500).send('Internal Server Error')
  }

}


