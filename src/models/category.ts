import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';

interface categoryInstance extends Model {
  categoryID: number,
  name: string,
}
const categoryModel = sequelize.define<categoryInstance>('category', {
  categoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'category'
})

// Joi schema for validation
const categoryValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required(),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records
categoryModel.beforeCreate(validateData(categoryModel, categoryValidationSchema));
categoryModel.beforeUpdate(validateData(categoryModel, categoryValidationSchema));

export { categoryModel, categoryInstance };