"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const orderModel = db_1.sequelize.define('orderDetails', {
    orderID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    addressID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isPaid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subTotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'orderDetails'
});
exports.orderModel = orderModel;
