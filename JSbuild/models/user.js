"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authenticationController_1 = require("../controllers/authenticationController");
const userModel = db_1.sequelize.define('users', {
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING,
    },
    image: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'users'
});
exports.userModel = userModel;
userModel.beforeSave(async (thisUser) => {
    if (thisUser.changed('password') || thisUser.isNewRecord) {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPass = await bcrypt_1.default.hash(thisUser.password, salt);
        thisUser.password = hashedPass;
    }
});
userModel.beforeValidate(async (thisUser) => {
    console.log(thisUser.password);
    if (thisUser.isNewRecord || thisUser.changed('password')) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!thisUser.password.match(passwordPattern)) {
            throw new Error('Password does not meet requirements: It must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters');
        }
    }
    else if (thisUser.changed('email')) {
        const foundUser = await (0, authenticationController_1.findUser)(thisUser.email);
        if (foundUser) {
            throw new Error('Email already exists');
        }
    }
});
