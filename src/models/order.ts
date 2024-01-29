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
  state: string,
  isPaid: boolean;
  date: string,
  paymentMethod: string,
  grandTotal: number,
  displayID: number
}
const orderModel = sequelize.define<orderInstance>('orderDetails', {
    orderID: {
      type: DataTypes.INTEGER,
      primaryKey: true
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
    addressID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
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
  



export { orderModel, orderInstance };
