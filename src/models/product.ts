import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";

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


  }, {
    timestamps: false,
    tableName: 'products'
  })
  


export { productModel, productInstance };