"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncModels = exports.sequelize = void 0;
const dbconfig_1 = __importDefault(require("./dbconfig"));
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(dbconfig_1.default.DB, dbconfig_1.default.USER, dbconfig_1.default.PASSWORD, {
    host: dbconfig_1.default.HOST,
    dialect: dbconfig_1.default.dialect,
    pool: {
        max: dbconfig_1.default.pool.max,
        min: dbconfig_1.default.pool.min
    },
    logging: console.log,
});
exports.sequelize = sequelize;
async function syncModels() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // {force: true}
        await sequelize.sync();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
exports.syncModels = syncModels;
