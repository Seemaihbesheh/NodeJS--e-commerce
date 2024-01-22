"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = exports.deleteProductFromCart = exports.moveToWishlist = exports.updateProductQuantityInCart = exports.getCart = void 0;
const modelsRelations_1 = require("../models/modelsRelations");
const { QueryTypes } = require('sequelize');
const getCart = async function getCartContent(req, res) {
    try {
        const userID = req.user.userID;
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
        const cartContent = await modelsRelations_1.cartModel.findAll({
            attributes: [
                "productQuantity"
            ],
            where: {
                userID,
                isOrdered: false,
            },
            include: [
                {
                    model: modelsRelations_1.productModel,
                    attributes: ["productID", "title", "subTitle", "price", "quantity", "discount"],
                    include: [
                        {
                            model: modelsRelations_1.imageModel,
                            attributes: ["imgPath"],
                            where: { position: 1 },
                            required: false,
                        }
                    ]
                },
            ],
        });
        return res.status(200).json(cartContent);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Internal Server Error');
    }
};
exports.getCart = getCart;
const updateProductQuantityInCart = async function (req, res) {
    try {
        const productID = req.params.productID;
        const newQuantity = req.body.newQuantity;
        const userID = req.user.userID;
        if (!productID || !newQuantity) {
            throw new Error();
        }
        const product = await modelsRelations_1.productModel.findByPk(productID);
        if (!product) {
            return res.status(404).json("Product does not exist");
        }
        if (product.quantity < newQuantity) {
            return res.status(404).json("No enough quantity");
        }
        const cartProduct = await modelsRelations_1.cartModel.findOne({
            where: {
                userID: userID,
                productID: productID,
                isOrdered: 0,
            },
        });
        if (cartProduct) {
            const updatedProduct = await updateProduct(cartProduct.productID, userID, newQuantity);
            return res.status(200).json(updatedProduct);
        }
        else {
            return res.status(404).json('Product not found in the user\'s cart.');
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Internal Server Error');
    }
};
exports.updateProductQuantityInCart = updateProductQuantityInCart;
const moveToWishlist = async function moveToWishlist(req, res) {
    try {
        const productID = req.params.productID;
        const userID = req.user.userID;
        if (!productID || !userID) {
            return res.status(400).json('All fields are required');
        }
        const productInCart = await modelsRelations_1.cartModel.findOne({ where: { userID: userID, productID: productID } });
        if (productInCart) {
            const productInWishList = await modelsRelations_1.wishListModel.findOne({ where: { userID: userID, productID: productID } });
            if (productInWishList) {
                return res.status(400).json('Product Already in the wishList');
            }
            const removedFromCart = await modelsRelations_1.cartModel.destroy({ where: { userID: userID, productID: productID } });
            if (removedFromCart) {
                const newWishlistProduct = await modelsRelations_1.wishListModel.create({
                    userID: userID,
                    productID: productID,
                });
                return res.status(200).json(newWishlistProduct);
            }
        }
        return res.status(400).json(`Product isn't Added To the Cart`);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Internal Server Error');
    }
};
exports.moveToWishlist = moveToWishlist;
const deleteProductFromCart = async function (req, res) {
    try {
        const productID = req.params.productID;
        const product = await modelsRelations_1.productModel.findByPk(productID);
        if (!product) {
            return res.status(404).json("product does not exist");
        }
        const userID = req.user.userID;
        await modelsRelations_1.cartModel.destroy({
            where: {
                userID: userID,
                productID: productID,
                isOrdered: 0
            }
        });
        return res.json("deleted successfully");
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};
exports.deleteProductFromCart = deleteProductFromCart;
const addToCart = async function (req, res) {
    try {
        if (!req.body.productID || typeof (req.body.productID) != 'number' || !req.body.productQuantity || typeof (req.body.productQuantity) != "number") {
            res.status(400).json("Invalid field");
            return;
        }
        const productID = req.body.productID;
        const userID = req.user.userID;
        const product = await modelsRelations_1.productModel.findByPk(productID);
        if (!product) {
            return res.status(404).json("product does not exist");
        }
        if (product.quantity < req.body.quantity) {
            return res.status(404).json("no enough quantity");
        }
        const productExist = await modelsRelations_1.cartModel.findOne({
            where: {
                productID: productID,
                userID: userID
            }
        });
        // if product exist I will update the quantity 
        if (productExist) {
            updateProduct(productExist.productID, userID, productExist.productQuantity + req.body.productQuantity);
        }
        else {
            const newCart = {
                userID: userID,
                productID: productID,
                productQuantity: req.body.productQuantity,
                isOrdered: 0
            };
            const result = await modelsRelations_1.cartModel.create(newCart);
        }
        return res.status(201).json("Successfully added to cart");
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json("Internal Server Error");
    }
};
exports.addToCart = addToCart;
async function updateProduct(cartProductID, userID, newQuantity) {
    try {
        return await modelsRelations_1.cartModel.update({ productQuantity: newQuantity }, {
            where: {
                productID: cartProductID,
                userID: userID
            }
        });
    }
    catch (err) {
        throw err;
    }
}
