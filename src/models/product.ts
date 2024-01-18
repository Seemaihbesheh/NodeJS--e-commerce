import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

interface productInstance extends Model {
    productID: number,
    title: string,
    subTitle: string,
    description: string,
    price: number,
    quantity: number,
    category: number,
    discount: number,
    arrivalDate: string,
    brand: number
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
    }

  }, {
    timestamps: false,
    tableName: 'products'
  })
  
export {productModel, productInstance}