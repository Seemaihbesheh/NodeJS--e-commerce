import * as models from '../models/modelsRelations'
import { CustomError } from './customError'
import { sequelize } from "../config/db"

export const findUser = async function (findBy: { userID?: number, email?: string }): Promise<any> {
  try {
    const foundUser = await models.userModel.findOne({ where: findBy })

    if (!foundUser) {
      throw new CustomError('User Not found', 500)
    }
    return foundUser

  } catch (err) {
    console.log(err.message)
    throw new CustomError(err, 500)
  }
}

export const findAllUsers = async function (page: number, pageSize: number): Promise<any> {
  try {
    const users = await models.userModel.findAndCountAll({
      attributes: [
        "userID",
        "firstName",
        "lastName",
        "email",
        "mobile",
        "image"
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    return users
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

export const getUserProfile = async function (userID: number): Promise<any> {
  try {
    return await models.userModel.findByPk(userID, {
      attributes: [
        "firstName",
        "lastName",
        "email",
        "mobile",
        "image",
        "dateOfBirth"
      ]
    })
  } catch (err) {

    throw new CustomError('Internal Server Error', 500)
  }
}

export const updateUserProfile = async function (userID: number, updateData: { firstName?: string, lastName?: string, image?: Buffer }): Promise<any> {
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
};
