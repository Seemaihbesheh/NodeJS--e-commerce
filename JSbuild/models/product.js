"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const productModel = db_1.sequelize.define('products', {
    productID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subTitle: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    categoryID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    discount: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    arrivalDate: {
        type: sequelize_1.DataTypes.DATE
    },
    brandID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'products'
});
exports.productModel = productModel;
