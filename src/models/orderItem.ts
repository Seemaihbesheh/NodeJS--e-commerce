import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";

interface orderItemInstance extends Model {
  orderItemID: number,
  orderID: number,
  productID: number,
  productQuantity: number,
  productPrice: number,
  productTitle: string,
  productSubtitle: string,
  productDiscount: string,
  subTotal: number
}
const orderItemModel = sequelize.define<orderItemInstance>('orderItems', {
  orderItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderID: {
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
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productSubtitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productDiscount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT
  }
}, {
  timestamps: false,
  tableName: 'orderitems'
})



export { orderItemModel, orderItemInstance };
