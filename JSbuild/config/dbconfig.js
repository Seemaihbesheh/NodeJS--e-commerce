"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'root.Password66',
    DB: 'coraldatabase',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 1
    }
};
exports.default = dbConfig;
