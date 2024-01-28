import { Request, Response } from 'express'
import { findAllUsers } from '../../services/userServices'

export const allUsers = async function (req: Request, res: Response): Promise<any> {
  try {

    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 20
    const users = await findAllUsers(page, pageSize)

    const allUsers = users.rows.map(user => ({
      userID: user.userID,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      mobile: user.mobile,
      image: user.image,
    }))

    return res.status(200).json({ count: users.count, users: allUsers })

  } catch (err) {
    return res.status(err.status).json(err.message)
  }
}