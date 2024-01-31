import { Request, Response, NextFunction } from 'express'
import * as sessionServices from '../../services/sessionServices'
import * as userServices from '../../services/userServices'

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { headers: headersData } = req
        console.log(req.headers)
        if (!headersData.authorization) {
            return res.status(400).json({ error: 'Session ID not provided in headers' })
        }

        const foundSession = await sessionServices.findSession(headersData.authorization)

        if (foundSession) {
            const user = await userServices.findUser({userID: foundSession.userID})

            if (user && user.role === 'admin') {
                return next()
            } else {
                return res.status(403).json({ error: 'Permission denied' })
            }
        } else {
            return res.status(400).json({ error: 'Session not found or timed out. Please log in again.' })
        }
    } catch (error) {
        next(error)
    }
}

export default isAdmin