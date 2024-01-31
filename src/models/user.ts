import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import {CustomError} from '../services/customError'
import { findUser } from "../services/userServices"


interface userInstance extends Model {
  userID: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  mobile: string,
  image?: Buffer | null, // Adjusted type for image
  dateOfBirth : Date,
  role: string

}
const userModel = sequelize.define<userInstance>('users', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
  },
  image: {
  type: DataTypes.BLOB('long'), 
   allowNull:true,  
  },
    dateOfBirth:{
    type: DataTypes.DATE,
    allowNull: true,

  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'customer'
  }
}, {
  timestamps: false,
  tableName: 'users'
})


export {
  userModel,
  userInstance
}
