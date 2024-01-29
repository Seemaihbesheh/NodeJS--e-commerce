import { Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as WishlistService from '../../services/wishlistServices'
import { wishListValidationSchema } from '../../validators/validateSchema'
export const getWishList = async function (req: CustomRequest, res: Response): Promise<any> {
    try {
        const userID = req.user.userID

        const wishLists = await WishlistService.getWishListItems(userID)

        if (wishLists.length > 0) {
            return res.status(200).json(wishLists)
        } else {
            return res.status(404).json({ error: ` No wishList Found for ${req.user.firstName} ` })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json(error.message)
    }
}
export const toggleWishlist = async function (req: CustomRequest, res: Response): Promise<any> {

    try {
        //const productID = Number(req.params.productID)
        const productID = req.params.productID
        const userID = req.user.userID
        // Validating the request body against the schema
        const validationResult = wishListValidationSchema.validate({ userID, productID });

        if (validationResult.error) {
            return res.status(400).json("Invalid Input");
        }

        const result = await WishlistService.toggleWishlistItem(userID, productID)
        return res.status(200).json(result)

    } catch (error) {
        console.error(error)
        return res.status(500).json(error.message)
    }
}