import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/sessionMiddleware'
import * as addressServices from '../../services/addressServices'

export const getUserAddresses = async (req: CustomRequest, res: Response): Promise<any> => {

  try {
    const userID = req.user.userID

    if (!userID) {
      return res.status(400).json({ error: 'userID is required' })
    }

    const address = await addressServices.getUserAddresses(userID)


    if (!address) {
      return res.status(400).json('Not Found')
    }

    return res.json({ address })


  } catch (error) {
    console.error(error)
    return res.status(500).json(error.message)
  }
}