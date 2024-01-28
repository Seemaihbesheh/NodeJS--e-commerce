import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
interface orderItemInstance extends Model {
  orderItemID: number,
  orderID: number,
  productID: number,
  productQuantity: number,
  productPrice: number,
  productTitle: string;
  productSubtitle: string;
  productDiscount: number;
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
}, {
  timestamps: false,
  tableName: 'orderitems'
})

// Joi schema for validation
const orderItemValidationSchema = Joi.object({
  orderID: Joi.number().integer().positive().required(),
  productID: Joi.number().integer().positive().required(),
  productQuantity: Joi.number().integer().min(1).required(),
  productPrice: Joi.number().precision(2).positive().required(),
  productTitle: Joi.string().trim().min(3).max(255).required(),
  productSubtitle: Joi.string().trim().min(3).max(255).required(),
  productDiscount: Joi.number().integer().min(0).max(100).required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records
orderItemModel.beforeCreate(validateData(orderItemModel, orderItemValidationSchema));
orderItemModel.beforeUpdate(validateData(orderItemModel, orderItemValidationSchema));
export { orderItemModel, orderItemInstance };
