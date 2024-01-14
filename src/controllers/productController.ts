import { sequelize } from "../config/db"
import { productModel } from "../models/modelsRelations"
import { Request, Response } from 'express'

// find from rating avg for each product and return products whome avg > 4.5 
export const getTrendyProducts = async function(req:Request , res:Response): Promise<any> {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 20
        const trendyProducts = await productModel.findAll({
            attributes: [ 
                "productID",
                "title",
                "subTitle",
                "description",
                "price",
                "quantity",
                "category",
                "discount"
                , [sequelize.literal('(SELECT AVG(rating) FROM ratings WHERE ratings.productID = products.productID)'),'avgRating']
            ],
            having: sequelize.literal('avgRating > 4.5'),
            order: [[sequelize.literal('avgRating'),'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,

        })
        return res.status(200).json({"products" : trendyProducts})
    } catch (err) {
        return res.status(500).json({ error: 'Failed to get products', details: err.message })
    }
}

export default {
    getTrendyProducts
}