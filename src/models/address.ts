import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import Joi from "joi";
import validateData from '../validators/validateSchema';

interface addressInstance extends Model {
    addressID: number,
    userID: number,
    street: string,
    state: string,
    city: string,
    pinCode: number
  }
const addressModel = sequelize.define<addressInstance> ('addresses',{
    addressID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER
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
    pinCode : {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    timestamps: false,
    tableName: 'addresses'
  })

  const addressSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    street: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    pinCode: Joi.number().integer().positive().required(),
});
// Validate data before creating/updating records
addressModel.beforeCreate(validateData(addressModel, addressSchema, { abortEarly: false }));
addressModel.beforeUpdate(validateData(addressModel, addressSchema, { abortEarly: false }));

export { addressModel, addressInstance };
