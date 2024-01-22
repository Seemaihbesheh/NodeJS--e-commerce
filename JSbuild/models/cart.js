"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const cartModel = db_1.sequelize.define('cart', {
    cartID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productQuantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    isOrdered: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    tableName: 'cart'
});
exports.cartModel = cartModel;
