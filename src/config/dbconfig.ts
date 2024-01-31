import { Dialect } from "sequelize"

const dbConfig= {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DB: 'coraldatabase',
    dialect: 'mysql' as Dialect,
    pool: {
        max: 10,
        min: 1
    }
}
export default dbConfig
