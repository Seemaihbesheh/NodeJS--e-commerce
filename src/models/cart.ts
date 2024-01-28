import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
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

// Joi schema for validation
const cartValidationSchema = Joi.object({
  userID: Joi.number().integer().positive().required(),
  productID: Joi.number().integer().positive().required(),
  productQuantity: Joi.number().integer().min(1).required(),
  isOrdered: Joi.boolean().required(),
}).options({ abortEarly: false, stripUnknown: true });


cartModel.beforeCreate(validateData(cartModel, cartValidationSchema));
cartModel.beforeUpdate(validateData(cartModel, cartValidationSchema));

export { cartModel, cartInstance };