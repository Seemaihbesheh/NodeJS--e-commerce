import { sessionModel, userModel } from '../../models/modelsRelations'
import { NextFunction, Request, Response } from 'express'
interface CustomRequest extends Request {
  session?: any,
  user? :any
}
//this middleware for authorized requests
const sessionMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { headers: headersData } = req
    console.log(req.headers);
    if (!headersData.authorization) {
      return res.status(400).json({ error: 'Session ID not provided in headers' })
    }

    isAuth(req , res , next)

  } catch (error) {
    next(error)
  }
}
//this middleware for authorized and unauthorized requests
const optionalAutorization = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { headers: headersData } = req
    console.log(req.headers);
    if (!headersData.authorization) {
      req.user = null;
      next();
      return;
    }

    isAuth(req , res , next)

  } catch (error) {
    next(error)
  }
}

async function isAuth(req , res  , next) {
  try{

    const foundSession = await sessionModel.findOne({ where: { sessionID: req.headers.authorization } })

    if (foundSession) {
      const user = await userModel.findByPk(foundSession.dataValues.userID);
      req.user = user;
      req.session = foundSession
      next()
    } else {
      return res.status(400).json({error: 'Session not found or timed out. Please log in again.'})
    }

  }catch (error) {
    next(error)
  }
}

export {
  sessionMiddleware,
  optionalAutorization,
  CustomRequest,
} 