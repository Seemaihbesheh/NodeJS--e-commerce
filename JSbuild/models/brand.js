"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const brandModel = db_1.sequelize.define('brand', {
    brandID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'brand'
});
exports.brandModel = brandModel;
