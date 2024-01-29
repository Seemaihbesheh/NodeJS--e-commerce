import express, { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
const router = express.Router()
import * as authenticationServices from '../../services/authenticationServices'


export const signUp = async function (req: Request, res: Response): Promise<any> {
  try {
    const result = await authenticationServices.signUp(req.body)
    res.status(200).json(result)
  } catch (error) {
    res.status(error.status).json(error.message)
  }
}

export const login = async function (req: Request, res: Response): Promise<any> {
  try {
    const result = await authenticationServices.login(req.body)
    res.status(200).json(result)
  } catch (error) {
    res.status(error.status).json(error.message)
  }
}

export const changePassword = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user.userID
    const result = await changePassword(userID, req.body)
    res.status(200).json(result)
  } catch (error) {
    res.status(error.status).json(error.message)
  }

}

export const logout = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const sessionID = req.session.sessionID
    await authenticationServices.logout(sessionID)
    res.status(200)
  } catch (error) {
    res.status(error.status).json(error.message)
  }

}

export default router