"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const sessionModel = db_1.sequelize.define('sessions', {
    sessionID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'sessions'
});
exports.sessionModel = sessionModel;
