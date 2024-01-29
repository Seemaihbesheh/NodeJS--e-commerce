import { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import { userModel } from '../../models/user';

import { sequelize } from "../../config/db"
import { addressModel } from '../../models/modelsRelations'
import { Op } from 'sequelize';

//allUsers
export const allUsers = async function (req: Request, res: Response): Promise<any> {
  try {
 
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 20
    const users = await userModel.findAndCountAll({
      attributes: [
        "firstName",
        "lastName",
        "email",
        "mobile",
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    
    const allUsers = users.rows.map(user => ({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      mobile: user.mobile,
      image: user.image,
    }));
    
    return res.status(200).json({ count: users.count, users: allUsers });

  } catch (err) {
    return res.status(500).json( 'Failed to get users' )
  }
}



