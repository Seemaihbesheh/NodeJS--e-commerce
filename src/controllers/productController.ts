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
                , [sequelize.literal('(SELECT AVG(rating) FROM ratings WHERE ratings.productID = products.productID)'), 'avgRating'],

            ],
            include: [
                {
                    model: imageModel,
                    attributes: ['imgPath'],
                    where: sequelize.literal('position = 1'),
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [
                        [sequelize.literal('(SELECT count(rating) FROM ratings WHERE ratings.productID = products.productID)'), 'ratingsCount'],
                    ]
                }
            ],
            having: sequelize.literal('avgRating >= 4.5'),
            order: [[sequelize.literal('avgRating'), 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,

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
        return products
    }

    const isAddedPromises = products.map(product => isAdedToWishlist(userID, product.productID))
    const isAddedResults = await Promise.all(isAddedPromises);

    return products.map((product, index) => ({
        ...product.toJSON(),
        isAdded: isAddedResults[index],
    }))
}