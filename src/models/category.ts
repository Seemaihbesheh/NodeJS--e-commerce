import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

const categoryModel = sequelize.define('category', {
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

export {categoryModel}