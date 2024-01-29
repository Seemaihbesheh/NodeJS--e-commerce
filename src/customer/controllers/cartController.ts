import { Response } from 'express'
import * as cartServices from '../../services/cartServices'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import {cartValidationSchema} from '../../validators/validateSchema'

export const getCartContent = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user.userID

    const cartContent = await cartServices.getCartContent(userID)

    return res.status(200).json(cartContent)
  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}

export const updateProductQuantityInCart = async function (req: CustomRequest, res: Response): Promise<any> {
  try {

    const productID = Number(req.params.productID)
    const newQuantity = req.body.newQuantity
    const userID = req.user.userID


// Validating the request body against the schema
const validationResult = cartValidationSchema.validate({ userID,productID, newQuantity });

if (validationResult.error) {
    return res.status(400).json("Invalid Input");
}

    await cartServices.updateProductQuantityInCart(userID, productID, newQuantity)

    return res.status(200)
  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}

export const moveToWishlist = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const productID = Number(req.params.productID)
    const userID = req.user.userID

    if (!productID) {
      return res.status(400).json('Invalid Input')
    }

    await cartServices.moveToWishlist(userID, productID)

    return res.status(200)
  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}

export const deleteProductFromCart = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const productID = Number(req.params.productID)
    const userID = req.user.userID;

     // Validating the request body against the schema
     const validationResult = cartValidationSchema.validate({ productID, userID });

     if (validationResult.error) {
         return res.status(400).json("Invalid Input");
     }

    await cartServices.deleteProductFromCart(userID, productID)

    return res.status(200)
  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}

export const addToCart = async function (req: CustomRequest, res: Response): Promise<any> {
  try {

    const productID = Number(req.body.productID)
    const userID = req.user.userID
    const productQuantity = req.body.productQuantity

    // Validating the request body against the schema
const validationResult = cartValidationSchema.validate({ userID,productID, productQuantity });

if (validationResult.error) {
    return res.status(400).json("Invalid Input");
}


    const result = await cartServices.addToCart(userID, productID, productQuantity)

    return res.status(201).json(result)
  } catch (error) {
    console.error(error.message)
    return res.status(error.status).json(error.message)
  }
}

