import { sequelize } from "../../config/db"
import { Request, Response } from 'express'
import * as orderSevices from '../../services/orderServices'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as cartServices from '../../services/cartServices'
import * as productSevices from '../../services/productServices'
import * as addressServices from '../../services/addressServices'
import { addressValidationSchema } from '../../validators/validateSchema'

export const getSpecificOrder = async function (req: Request, res: Response): Promise<any> {
  try {

    const orderID = Number(req.query.orderID)

    if (!orderID) {
      return res.status(404).json({error: "Invalid input"})
    }
    const orderDetails = await orderSevices.getSpecificOrder(orderID)
    res.status(200).json(orderDetails)

  } catch (error) {
    console.error(error)
    res.status(error.status).json({error: error.message})
  }
}

export const placeOrder = async function (req: CustomRequest, res: Response): Promise<any> {

  const transaction = await sequelize.transaction()

  try {

    const userID = req.user.userID
    let isPaid = true

    const { street, state, city, pinCode } = req.body
    
    const validationResult = addressValidationSchema.validate({ street, state, city, pinCode });

    if (validationResult.error) {
      return res.status(400).json({error: "Invalid Input"});
    }
    const existingAddress = await addressServices.findAddress({ userID, street, state, city, pinCode })

    if (!existingAddress) {
      await addressServices.createAddress({
        userID,
        street,
        state,
        city,
        pinCode,
      }, transaction)
    }
    
    const email = req.user.email

    const { fullName, mobile, paymentMethod } = req.body

    if(!fullName||!mobile||!paymentMethod){
      return res.status(400).json({error: "Invalid Input"});
    }

    const orderItems = req.body.orderItems
    if(!orderItems){
      return res.status(400).json({error: "Invalid Input"});
    }
    let grandTotal = 0

    await Promise.all(orderItems.map(async (element) => {
      const productExist = await productSevices.getProduct(element.productID, {
        transaction: transaction,
        lock: true
      })
      if (!productExist) return res.status(400).json({error: `product doesn't exist`})

       element.productPrice = productExist.price,
        element.productTitle = productExist.title,
        element.productSubtitle = productExist.subTitle,
        element.productDiscount = productExist.discount,
        element.subTotal = (productExist.price * (1 - productExist.discount / 100) * element.productQuantity),
        element.productQuantity = element.productQuantity
        element.quantity = productExist.quantity
      grandTotal += element.subTotal
    }))

    if (paymentMethod === 'cash On Delivery') isPaid = false
    
    const newOrder = await orderSevices.createOrder({
      userID,
      fullName,
      email,
      mobile,
      street,
      state,
      city,
      pinCode,
      isPaid,
      paymentMethod,
      grandTotal,
    }, transaction)
    const orderID = newOrder.orderID

    await Promise.all(orderItems.map(async (element) => {
      await orderSevices.createOrderItem(element, orderID, transaction)
      let productID = element.productID
      let newQuantity = element.quantity - element.productQuantity
      await productSevices.updateProduct(productID, { quantity: newQuantity }, transaction)
      await cartServices.updateProductInCart(productID, userID, { isOrdered: true }, transaction)

    }))
    await transaction.commit()
    return res.status(201).json(newOrder)

  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({error: error.message})
  }

}


