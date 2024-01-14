import { sessionModel } from '../models/modelsRelations'
import { NextFunction, Request, Response } from 'express'
interface CustomRequest extends Request {
  session?: any
}
const sessionMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { headers: headersData } = req
    if (!headersData.Authorization) {
      return res.status(400).json({ error: 'Session ID not provided in headers' })
    }
    const foundSession = await sessionModel.findOne({ where: { sessionID: headersData.Authorization } })

    if (foundSession) {
      req.session = foundSession
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