import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";


interface addressInstance extends Model {
  addressID: number,
  userID: number,
  street: string,
  state: string,
  city: string,
  pinCode: number
}
const addressModel = sequelize.define<addressInstance>('addresses', {
  addressID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userID: {

    type: DataTypes.INTEGER,
    allowNull: false  
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pinCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: false,
  tableName: 'addresses'
})

export {
  addressInstance,
  addressModel
}
