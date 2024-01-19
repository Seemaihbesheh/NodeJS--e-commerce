import { sequelize } from "../config/db"
import { productModel } from "../models/modelsRelations"
import { wishListModel } from "../models/modelsRelations"
import { Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'


export const getWishList = async function (req: CustomRequest, res: Response): Promise<any> {
    try {
        const userID = req.user.userID
        if (!userID) {
            res.status(400).json({ error: ' userid  required.' })
            return;
        }
        const Wishlists = await wishListModel.findAll({
            attributes: [],
            include: [{
                model: productModel,
                attributes: ['title', 'subTitle', 'price', 'quantity'],
            }],
            where: {
                userID: userID,
            }
        })
        if (Wishlists) {
            return res.status(200).json(Wishlists)
        }
        else {
            return res.status(404).json({ error: ` No wishList Found for ${req.user.firstName} ` })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
export const toggleWishlist = async function (req: CustomRequest, res: Response): Promise<any> {
    try {
        const productID = req.params.productID
        const userID = req.user.userID
        if (!userID || !productID) {
            res.status(400).json({ error: 'Both userid and productid are required.' })
            return;
        }
        const existInWishlist = await wishListModel.findOne({
            where: {
                userID: userID,
                productID: productID
            }
        })
        if (existInWishlist) {
            await wishListModel.destroy({where:{userID: userID, productID: productID }})
            return res.status(200).json('Removed from wishlist')
        }
        const newWishlist = await wishListModel.create({
            userID: userID,
            productID: productID,
        })
        return res.status(200).json({"msg": "added to wishlist" , newWishlist})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}