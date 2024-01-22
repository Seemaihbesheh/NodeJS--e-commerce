"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishList = void 0;
const modelsRelations_1 = require("../models/modelsRelations");
const modelsRelations_2 = require("../models/modelsRelations");
const getWishList = async function (req, res) {
    try {
        const userID = req.user.userID;
        if (!userID) {
            res.status(400).json({ error: ' userid  required.' });
            return;
        }
        const Wishlists = await modelsRelations_2.wishListModel.findAll({
            attributes: [],
            include: [{
                    model: modelsRelations_1.productModel,
                    attributes: ['title', 'subTitle', 'price', 'quantity'],
                }],
            where: {
                userID: userID,
            }
        });
        if (Wishlists) {
            return res.status(200).json(Wishlists);
        }
        else {
            return res.status(404).json({ error: ` No wishList Found for ${req.user.firstName} ` });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getWishList = getWishList;
const toggleWishlist = async function (req, res) {
    try {
        const productID = req.params.productID;
        const userID = req.user.userID;
        if (!userID || !productID) {
            res.status(400).json({ error: 'Both userid and productid are required.' });
            return;
        }
        const existInWishlist = await modelsRelations_2.wishListModel.findOne({
            where: {
                userID: userID,
                productID: productID
            }
        });
        if (existInWishlist) {
            await modelsRelations_2.wishListModel.destroy({ where: { userID: userID, productID: productID } });
            return res.status(200).json('Removed from wishlist');
        }
        const newWishlist = await modelsRelations_2.wishListModel.create({
            userID: userID,
            productID: productID,
        });
        return res.status(200).json({ "msg": "added to wishlist", newWishlist });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.toggleWishlist = toggleWishlist;
