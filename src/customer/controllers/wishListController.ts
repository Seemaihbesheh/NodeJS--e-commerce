import { Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as WishlistService from '../../services/wishlistServices'
import { wishListValidationSchema } from '../../validators/validateSchema'

export const getWishList = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user.userID

    const wishList = await WishlistService.getWishListItems(userID)
    return res.status(200).json(wishList)
  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}
export const toggleWishlist = async function (req: CustomRequest, res: Response): Promise<any> {

  try {
    const productID = req.params.productID
    const userID = req.user.userID

    const validationResult = wishListValidationSchema.validate({ userID, productID });

    if (validationResult.error) {
        return res.status(400).json("Invalid Input");
    }
    const result = await WishlistService.toggleWishlistItem(userID, productID)
    return res.status(200).json(result)

  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}