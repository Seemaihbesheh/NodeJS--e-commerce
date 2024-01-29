import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";


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
  



export { imageModel, imageInstance };
