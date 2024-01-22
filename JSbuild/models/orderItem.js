"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const orderItemModel = db_1.sequelize.define('orderItems', {
    orderItemID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderID: {
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
    productPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    productTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productSubtitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productDiscount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'orderitems'
});
exports.orderItemModel = orderItemModel;
