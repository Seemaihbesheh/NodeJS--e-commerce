"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryModel = exports.imageModel = exports.productModel = exports.orderItemModel = exports.orderModel = exports.addressModel = exports.ratingModel = exports.wishListModel = exports.cartModel = exports.sessionModel = exports.userModel = void 0;
const user_1 = require("./user");
Object.defineProperty(exports, "userModel", { enumerable: true, get: function () { return user_1.userModel; } });
const session_1 = require("./session");
Object.defineProperty(exports, "sessionModel", { enumerable: true, get: function () { return session_1.sessionModel; } });
const cart_1 = require("./cart");
Object.defineProperty(exports, "cartModel", { enumerable: true, get: function () { return cart_1.cartModel; } });
const wishList_1 = require("./wishList");
Object.defineProperty(exports, "wishListModel", { enumerable: true, get: function () { return wishList_1.wishListModel; } });
const rating_1 = require("./rating");
Object.defineProperty(exports, "ratingModel", { enumerable: true, get: function () { return rating_1.ratingModel; } });
const order_1 = require("./order");
Object.defineProperty(exports, "orderModel", { enumerable: true, get: function () { return order_1.orderModel; } });
const address_1 = require("./address");
Object.defineProperty(exports, "addressModel", { enumerable: true, get: function () { return address_1.addressModel; } });
const orderItem_1 = require("./orderItem");
Object.defineProperty(exports, "orderItemModel", { enumerable: true, get: function () { return orderItem_1.orderItemModel; } });
const product_1 = require("./product");
Object.defineProperty(exports, "productModel", { enumerable: true, get: function () { return product_1.productModel; } });
const images_1 = require("./images");
Object.defineProperty(exports, "imageModel", { enumerable: true, get: function () { return images_1.imageModel; } });
const brand_1 = require("./brand");
const category_1 = require("./category");
Object.defineProperty(exports, "categoryModel", { enumerable: true, get: function () { return category_1.categoryModel; } });
user_1.userModel.hasMany(session_1.sessionModel, { foreignKey: 'userID' });
session_1.sessionModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
user_1.userModel.hasMany(cart_1.cartModel, { foreignKey: 'userID' });
cart_1.cartModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
user_1.userModel.hasMany(wishList_1.wishListModel, { foreignKey: 'userID' });
wishList_1.wishListModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
user_1.userModel.hasMany(rating_1.ratingModel, { foreignKey: 'userID' });
rating_1.ratingModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
user_1.userModel.hasMany(address_1.addressModel, { foreignKey: 'userID' });
address_1.addressModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
user_1.userModel.hasMany(order_1.orderModel, { foreignKey: 'userID' });
order_1.orderModel.belongsTo(user_1.userModel, { foreignKey: 'userID' });
order_1.orderModel.hasMany(orderItem_1.orderItemModel, { foreignKey: 'orderID' });
orderItem_1.orderItemModel.belongsTo(order_1.orderModel, { foreignKey: 'orderID' });
product_1.productModel.hasMany(images_1.imageModel, { foreignKey: 'productID' });
images_1.imageModel.belongsTo(product_1.productModel, { foreignKey: 'productID' });
product_1.productModel.hasMany(rating_1.ratingModel, { foreignKey: 'productID' });
rating_1.ratingModel.belongsTo(product_1.productModel, { foreignKey: 'productID' });
cart_1.cartModel.hasMany(product_1.productModel, { foreignKey: 'productID' });
product_1.productModel.belongsTo(cart_1.cartModel, { foreignKey: 'productID' });
wishList_1.wishListModel.hasMany(product_1.productModel, { foreignKey: 'productID' });
product_1.productModel.belongsTo(wishList_1.wishListModel, { foreignKey: 'productID' });
brand_1.brandModel.hasMany(product_1.productModel, { foreignKey: 'brandID' });
product_1.productModel.belongsTo(brand_1.brandModel, { foreignKey: 'brandID' });
category_1.categoryModel.hasMany(product_1.productModel, { foreignKey: 'categoryID' });
product_1.productModel.belongsTo(category_1.categoryModel, { foreignKey: 'categoryID' });
// user has many sessions
// user has many carts
// user has many wishlists
// user has many ratings
// user has many orders
// user has many addresses
// order has many items
// product has many images
// product has many ratings
// wishlist has many products
// cart has many products
// category has many products
// brand has many products
