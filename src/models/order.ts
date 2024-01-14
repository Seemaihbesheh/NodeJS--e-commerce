import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

interface orderInstance extends Model {
  orderID: number,
  userID: number,
  firstName: string,
  lastName: string,
  email: string,
  mobile: string,
  addressID: number,
  status: string,
  date: string,
  paymentMethod: string,
  subTotal: number
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    subTotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'orderDetails'
  })
  
 export  {orderModel, orderInstance}