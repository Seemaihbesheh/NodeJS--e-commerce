import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
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
  // Joi schema for validation
const wishListValidationSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records

wishListModel.beforeCreate(validateData(wishListModel, wishListValidationSchema));
wishListModel.beforeUpdate(validateData(wishListModel, wishListValidationSchema));

 export {wishListModel, wishListInstance}