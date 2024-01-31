import { Dialect } from "sequelize"

const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: 'mysql' as Dialect,
    pool: {
        max: 10,
        min: 1
    }
}
export default dbConfig
