import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
import bcrypt from 'bcrypt'

import { findUser } from "../services/userServices"


interface userInstance extends Model {
  userID: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  mobile: string,
  image?: Buffer | null, // Adjusted type for image
  dateOfBirth : Date

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
    allowNull: false,
    validate: {
      isEmail: true
    }
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

  }
}, {
  timestamps: false,
  tableName: 'users'
})

userModel.beforeSave(async (thisUser: any) => {
  if (thisUser.isNewRecord && thisUser.Password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(thisUser.password, salt)
    thisUser.password = hashedPass
  }
})

userModel.beforeValidate(async (thisUser: any) => {
  console.log(thisUser.password)
  if (thisUser.isNewRecord && thisUser.Password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!thisUser.password.match(passwordPattern)) {
      throw new Error('Password does not meet requirements: It must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters');
    }
  } else if (thisUser.changed('email') && thisUser.Password) {
    const foundUser = await findUser(thisUser.email)
    if (foundUser) {
      throw new Error('Email already exists')
    }
  }
})

export {
  userModel,
  userInstance
}
