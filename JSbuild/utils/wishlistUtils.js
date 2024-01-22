"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdedToWishlist = void 0;
const modelsRelations_1 = require("../models/modelsRelations");
const isAdedToWishlist = async function isAdedToWishlist(userID, productID) {
    const isAdded = await modelsRelations_1.wishListModel.findOne({
        where: {
            userID: userID,
            productID: productID
        }
    });
    if (isAdded)
        return 1;
    else
        return 0;
};
exports.isAdedToWishlist = isAdedToWishlist;
