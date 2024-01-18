import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

interface cartInstance extends Model {
  cartID: number,
  userID: number,
  productID: number,
  productQuantity: number,
  isOrdered: boolean
}

const cartModel = sequelize.define<cartInstance>('cart', {
    cartID: {
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
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isOrdered : {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }

  }, {
    timestamps: false,
    tableName: 'cart'
  })

  export { cartModel, cartInstance }