import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from 'joi';
import validateData from '../validators/validateSchema';
const brandModel = sequelize.define('brand', {
    brandID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    timestamps: false,
    tableName: 'brand'
  }
  )
  
// Define Joi schema for validation
const brandValidationSchema  = Joi.object({
  brandID: Joi.number().integer(),
  name: Joi.string().trim().min(2).max(255).required(),
});


// Validate data before creating/updating records
brandModel.beforeCreate(validateData(brandModel, brandValidationSchema, { abortEarly: false }));
brandModel.beforeUpdate(validateData(brandModel, brandValidationSchema, { abortEarly: false }));

export { brandModel };
