import { sessionModel, userModel } from '../models/modelsRelations'
import { NextFunction, Request, Response } from 'express'
interface CustomRequest extends Request {
  session?: any,
  user? :any
}
const sessionMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { headers: headersData } = req
    if (!headersData.authorization) {
      return res.status(400).json({ error: 'Session ID not provided in headers' })
    }
    const foundSession = await sessionModel.findOne({ where: { sessionID: headersData.authorization } })
    const foundUser = await userModel.findOne({where: {userID : foundSession.userID}})
    if (foundSession) {
      req.session = foundSession
      req.user = foundUser
      next()
    } else {
      return res.status(400).json({error: 'Session not found or timed out. Please log in again.'})
    }
  } catch (error) {
    next(error)
  }
}

export {
  sessionMiddleware,
  CustomRequest,
} 