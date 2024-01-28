import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';

interface imageInstance extends Model {
  imageID: number,
  productID: number, 
  imgPath: string
  position: number;
}
const imageModel = sequelize.define<imageInstance>('images', {
    imageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imgPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'images'
  })
  
// Joi schema for validation
const imageValidationSchema = Joi.object({
  productID: Joi.number().integer().positive().required(),
  imgPath: Joi.string().trim().min(3).max(255).required(),
  position: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records

imageModel.beforeCreate(validateData(imageModel, imageValidationSchema));
imageModel.beforeUpdate(validateData(imageModel, imageValidationSchema));

export { imageModel, imageInstance };
