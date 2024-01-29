import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"


interface wishListInstance extends Model {
  wishlistID: number,
  userID: number,
  productID: number
}
const wishListModel = sequelize.define<wishListInstance>('wishList', {
  wishlistID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'wishList'
})

export { wishListModel, wishListInstance }
