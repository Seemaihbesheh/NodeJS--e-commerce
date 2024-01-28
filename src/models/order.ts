import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
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
  
// Joi schema for validation
const orderValidationSchema = Joi.object({
  userID: Joi.number().integer().positive().required(),
  fullName: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().email().required(),
  mobile: Joi.string().trim().pattern(/^\d{10}$/).required(),
  addressID: Joi.number().integer().positive().required(),
  state: Joi.string().trim().min(2).max(255).required(),
  isPaid: Joi.boolean().required(),
  date: Joi.date().iso().required(),
  paymentMethod: Joi.string().trim().min(2).max(255).required(),
  grandTotal: Joi.number().precision(2).positive().required(),
  displayID: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records
orderModel.beforeCreate(validateData(orderModel, orderValidationSchema));
orderModel.beforeUpdate(validateData(orderModel, orderValidationSchema));

export { orderModel, orderInstance };
