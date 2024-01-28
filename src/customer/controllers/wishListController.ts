import { Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as WishlistService from '../../services/wishlistServices'

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
    const productID = Number(req.params.productID)
    const userID = req.user.userID


    const result = await WishlistService.toggleWishlistItem(userID, productID)
    return res.status(200).json(result)

  } catch (error) {
    console.error(error)
    return res.status(error.status).json(error.message)
  }
}