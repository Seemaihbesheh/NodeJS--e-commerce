import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
interface ratingInstance extends Model {
  ratingID: number,
  userID: number,
  rating: number,
  productID: number

}
const ratingModel = sequelize.define<ratingInstance>('ratings', {
    ratingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'ratings'
  })
  
// Joi schema for validation
const ratingValidationSchema = Joi.object({
  userID: Joi.number().integer().positive().required(),
  rating: Joi.number().precision(2).min(0).max(5).required(), // Assuming ratings are between 0 and 5
  productID: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records


ratingModel.beforeCreate(validateData(ratingModel, ratingValidationSchema));
ratingModel.beforeUpdate(validateData(ratingModel, ratingValidationSchema));
export { ratingModel, ratingInstance };