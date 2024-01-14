import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

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
  })
  
 export {brandModel}