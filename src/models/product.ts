import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';
interface productInstance extends Model {
    productID: number,
    title: string,
    subTitle: string,
    description: string,
    price: number,
    quantity: number,
    categoryID: number;
    discount: number,
    arrivalDate: string,
    brand: number,
    image: string | null; // Assume image is stored as a URL, change to BLOB for binary storage
}
const productModel = sequelize.define<productInstance>('products', {
    productID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    arrivalDate: {
      type: DataTypes.DATE
    },
    brandID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // Change to DataTypes.BLOB for binary storage
      allowNull: true,
  },

  }, {
    timestamps: false,
    tableName: 'products'
  })
  
// Joi schema for validation
const productValidationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  subTitle: Joi.string().trim().min(3).max(255).allow(null),
  description: Joi.string().trim().allow(null),
  price: Joi.number().precision(2).positive().required(),
  quantity: Joi.number().integer().positive().required(),
  categoryID: Joi.number().integer().positive().required(),
  discount: Joi.number().precision(2).min(0).max(100).required(),
  arrivalDate: Joi.date().iso().allow(null),
  brandID: Joi.number().integer().positive().required(),
  image: Joi.string().uri().allow(null),
}).options({ abortEarly: false, stripUnknown: true });

// Validate data before creating/updating records

productModel.beforeCreate(validateData(productModel, productValidationSchema));
productModel.beforeUpdate(validateData(productModel, productValidationSchema));

export { productModel, productInstance };