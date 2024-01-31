import { generateSessionID } from "../utils/sessionUtils"
import { CustomError } from './customError'
import * as models from '../models/modelsRelations'

export const createSession = async function (userData): Promise<any> {
  try {
    const sessionID = generateSessionID()
    const sessionData = { sessionID, ...userData }

    return await models.sessionModel.create(sessionData)
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const findSession = async function (sessionID: any): Promise<any> {
  try {
    return await models.sessionModel.findOne({ where: { sessionID } })
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const deleteSession = async function (deleteOption: { userID?, sessionID?}): Promise<any> {
  try {
    await models.sessionModel.destroy({ where: deleteOption })
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}