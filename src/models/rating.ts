import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

interface ratingInstance extends Model {
  ratingID: number,
  userID: number,
  rating: number,
  productID: number

}
const ratingModel = sequelize.define<ratingInstance>('ratings', {
  ratingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'ratings'
})

export { ratingModel, ratingInstance }