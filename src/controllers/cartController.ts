import { sequelize } from "../config/db"
import { cartModel, productModel, imageModel, wishListModel } from "../models/modelsRelations"
import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
const { QueryTypes } = require('sequelize')

export const getCart = async function getCartContent(req: CustomRequest, res: Response): Promise<any> {
    try {
        const userID = req.user.userID
        // const cartContent = await sequelize.query(`
        // SELECT
        //     cart.productQuantity AS quantityInCart,
        //     products.title,
        //     products.subTitle,
        //     products.price,
        //     images.imgPath,
        //     products.quantity AS remainingQuantity
        // FROM
        //     cart
        // LEFT JOIN
        //     products ON cart.productID = products.productID
        // LEFT JOIN
        //     images ON products.productID = images.productID AND images.position = 1
        // WHERE
        //     cart.userID = ${userID}
        //     AND cart.isOrdered = false
        // `,{ type: QueryTypes.SELECT })

        const cartContent = await cartModel.findAll(
            {
                attributes: [
                    "productQuantity"
                ],
                where: {
                    userID,
                    isOrdered: false,
                },
                include: [
                    {
                        model: productModel,
                        attributes: ["productID", "title", "subTitle", "price", "quantity", "discount"],
                        include: [
                            {
                                model: imageModel,
                                attributes: ["imgPath"],
                                where: { position: 1 },
                                required: false,
                            }
                        ]
                    },
                ],

            }
        )
        return res.status(200).json(cartContent)
    } catch (err) {
        console.error(err)
        return res.status(500).json('Internal Server Error')
    }
}
export const updateProductQuantityInCart = async function (req: CustomRequest, res: Response): Promise<any> {
    try {
        const productID = req.params.productID
        const newQuantity = req.body.newQuantity
        const userID = req.user.userID
        if (!productID || !newQuantity) {
            throw new Error()
        }
        const product = await productModel.findByPk(productID)
        if (!product) {
            return res.status(404).json("Product does not exist")
        }
        if (product.quantity < newQuantity) {
            return res.status(404).json("No enough quantity")
        }
        const cartProduct = await cartModel.findOne({
            where: {
                userID: userID,
                productID: productID,
                isOrdered: 0,
            },
        })
        if (cartProduct) {
            const updatedProduct = await updateProduct(cartProduct.productID, userID, newQuantity)
            return res.status(200).json(updatedProduct)
        } else {
            return res.status(404).json('Product not found in the user\'s cart.')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json('Internal Server Error')
    }
}
export const moveToWishlist = async function moveToWishlist(req: CustomRequest, res: Response): Promise<any> {
    try {
        const productID = req.params.productID
        const userID = req.user.userID
        if (!productID || !userID) {
            return res.status(400).json('All fields are required')
        }
        const productInCart = await cartModel.findOne({ where: { userID: userID, productID: productID } })
        if (productInCart) {
            const productInWishList = await wishListModel.findOne({ where: { userID: userID, productID: productID } })
            if (productInWishList) {
                return res.status(400).json('Product Already in the wishList')
            }
            const removedFromCart = await cartModel.destroy({ where: { userID: userID, productID: productID } })
            if (removedFromCart) {
                const newWishlistProduct = await wishListModel.create({
                    userID: userID,
                    productID: productID,
                })
                return res.status(200).json(newWishlistProduct)
            }
        }
        return res.status(400).json(`Product isn't Added To the Cart`)
    } catch (err) {
        console.error(err)
        return res.status(500).json('Internal Server Error')
    }

}

export const deleteProductFromCart = async function (req:CustomRequest , res:Response): Promise<any>{
    try{
        const productID = req.params.productID;
        const product = await productModel.findByPk(productID);
        if(!product){
            return res.status(404).json("product does not exist");
            
        }
        const userID = req.user.userID;

        await cartModel.destroy({
            where: {
                userID: userID,
                productID: productID,
                isOrdered: 0
            }
        });

        return res.json("deleted successfully");

    }catch(error){
        return res.status(500).json("Internal Server Error");
    }
}


export const addToCart = async function (req:CustomRequest , res:Response): Promise<any>{
    try{
        if(!req.body.productID || typeof(req.body.productID) != 'number' || !req.body.productQuantity || typeof(req.body.productQuantity) !="number" ){
            res.status(400).json("Invalid field");
            return;
        }
        const productID = req.body.productID;
        const userID = req.user.userID;

        const product = await productModel.findByPk(productID);
        if(!product){
            return res.status(404).json("product does not exist");
        }

        if(product.quantity < req.body.quantity){
            return res.status(404).json("no enough quantity");
        }

        
        const productExist = await cartModel.findOne({
            where:{
                productID : productID,
                userID : userID
            }
        }) 

        // if product exist I will update the quantity 
        if(productExist){
            updateProduct(productExist.productID , userID, productExist.productQuantity + req.body.productQuantity);
        }else{
            const newCart = {
                userID : userID,
                productID : productID,
                productQuantity : req.body.productQuantity,
                isOrdered : 0
            }
            const result = await cartModel.create(newCart);
        }
        return res.status(201).json("Successfully added to cart");

    }catch(error){
        console.log(error.message)
        res.status(500).json("Internal Server Error");
    }
    
}

async function updateProduct(cartProductID: number, userID: number, newQuantity: any): Promise<any> {
    try {
        return await cartModel.update({ productQuantity: newQuantity },
            {
                where: {
                    productID: cartProductID,
                    userID: userID
                }
            }
        )
    } catch (err) {
        throw err
    }
}
