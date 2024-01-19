import { sequelize } from "../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel } from "../models/modelsRelations"
import { Request, Response } from 'express'
import { isAdedToWishlist } from '../utils/wishlistUtils'


export const getTrendyProducts = async function (req: Request, res: Response): Promise<any> {
    try {
        let productsWithIsAdded = []
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 20
        const trendyProducts = await productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount"
                , [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
                [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
            ],
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: sequelize.literal('position = 1'),
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [],
                     required: false
                }
            ],
            group: ['productID'],
            having: sequelize.literal('avgRating >= 4.5'),
            order: [[sequelize.literal('avgRating'), 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            subQuery: false

        })
        const count = trendyProducts.length
        productsWithIsAdded = await getProductsAndIsAdded(req, trendyProducts)

        return res.status(200).json({ "count": count, "products": productsWithIsAdded })
    } catch (err) {
        return res.status(500).json({ error: 'Failed to get products', details: err.message })
    }
}

async function isAuthorized(req: Request): Promise<boolean | number> {
    const { headers: headersData } = req
    if (!headersData.authorization) {
        return false
    }
    else {
        const foundSession = await sessionModel.findOne({ where: { sessionID: headersData.authorization } })
        const foundUser = await userModel.findOne({ where: { userID: foundSession.userID } })
        return foundUser.userID
    }
}

async function getProductsAndIsAdded(req: Request, products: any[]): Promise<any[]> {
    const userID = await isAuthorized(req)
    if (!userID) {
        return products.map((product) => ({
            ...product.toJSON(),
            isAddedToWishList: 0,
        }))
    }

    const isAddedPromises = products.map(product => isAdedToWishlist(userID, product.productID))
    const isAddedResults = await Promise.all(isAddedPromises);

    return products.map((product, index) => ({
        ...product.toJSON(),
        isAddedToWishList: isAddedResults[index],
    }))
}
