import * as models from '../models/modelsRelations'
import { CustomError } from './customError'
import { sequelize } from "../config/db"
import { hashPassword } from "../utils/userUtils"

export const createUser = async function (userData): Promise<any> {
  try {
    const { email, password, firstName, lastName } = userData
    const hashedPass = await hashPassword(password)

    return await models.userModel.create({
      email,
      password: hashedPass,
      firstName,
      lastName,
    })


  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }

}

export const findUser = async function (findBy: { userID?: number, email?: string }): Promise<any> {
  try {
    return await models.userModel.findOne({ where: findBy })

  } catch (err) {
    console.log(err.message)
    throw new CustomError('Internal Server Error', 500)
  }
}

export const findAllUsers = async function (page: number, pageSize: number): Promise<any> {
  try {
    const users = await models.userModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const allUsers = users.rows.map(user => ({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      mobile: user.mobile,
      image: user.image,
    }))

    return allUsers
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const getUserRatingsAndReviews = async function (userID: number): Promise<any> {
  try {
    return await models.ratingModel.findAll({
      attributes: [
        "rating",
      ],
      where: {
        userID: userID
      },
      include: [{
        model: models.productModel,
        as: "product",
        attributes: [
          "title",
          "subTitle",
          [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = ratings.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
        ],
        include: [{
          model: models.imageModel,
          attributes: [],
          where: {
            position: 1
          },
          as: "images",
          required: false
        }
        ]
      },
      ],
    })
  } catch (err) {

    throw new CustomError('Internal Server Error', 500)
  }
}

export const updateUserProfile = async function (userID: number, updateData: { firstName?: string, lastName?: string, dateOfBirth?: Date, image?: string , mobile? :string }): Promise<any> {
  try {

    const [rowCount, updatedUsers] = await models.userModel.update(
      { ...updateData },
      {
        where: {
          userID: userID
        },
        returning: true
      }
    )

    if (rowCount === 0) {
      throw new CustomError('User not found or no rows were updated.', 404);
    }

    // Assuming you may have multiple updated users, so using updatedUsers directly
    return updatedUsers;
  } catch (err) {
    throw new CustomError(err.message, 500);
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

export const getUserOrdersByStatus = async function (userID: number, status: string, page: number, pageSize: number): Promise<any> {
  try {

    const orders = await models.orderModel.findAll({
      attributes: ['displayID', 'date', 'grandTotal', 'isPaid'],
      where: {
        userID: userID,
        status: status
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    if (!orders) {
      throw new CustomError('No Orders were found', 404)
    }

    return orders

  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}
