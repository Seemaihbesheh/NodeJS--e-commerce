import { Dialect } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()
const dbConfig = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: 'mysql' as Dialect,
    pool: {
        max: 10,
        min: 1
    }
}
export default dbConfig
