import * as models from '../models/modelsRelations'
import { CustomError } from './customError'
import { sequelize } from "../config/db"

export const createAddress = async function (addressData: any, transaction?: any): Promise<any> {
  try {
    return await models.addressModel.create(addressData, { transaction })
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const getUserAddresses = async function (userID: number): Promise<any> {
  try {
    return await models.addressModel.findAll({
      attributes: [
        'street',
        'state',
        'city',
        'pinCode',
      ],
      include: [
        {
          model: models.userModel,
          attributes: [[sequelize.literal('CONCAT(`user`.`firstName`, " ", `user`.`lastName`)'), 'fullName'], 'mobile'
          ],
          as: 'user',
          required: false
        }
      ],
      where: {
        userID: userID
      }
    })
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const findAddress = async function (addressData: any): Promise<any> {
  try {
    await models.addressModel.findOne({
      where: {
        addressData
      },
    })
  } catch (error) {

  }
}