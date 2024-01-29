import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";

interface orderInstance extends Model {
  orderID: number,
  userID: number,
  fullName: string,
  email: string,
  mobile: string,
  addressID: number,
  isPaid: boolean,
  street: string,
  state: string,
  city: string,
  pinCode: string,
  status: string,
   date: string,
  paymentMethod: string,
  grandTotal: number,
  displayID: number
}
const orderModel = sequelize.define<orderInstance>('orderDetails', {

  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  displayID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'orderDetails'
})

export { orderModel, orderInstance }

