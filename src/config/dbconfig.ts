import { Dialect } from "sequelize"

const dbConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'seema123.I',
    DB: 'coraldatabase',
    dialect: 'mysql' as Dialect,
    pool: {
        max: 10,
        min: 1
    }
}
export default dbConfig
