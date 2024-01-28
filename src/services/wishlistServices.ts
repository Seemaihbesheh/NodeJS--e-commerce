import * as models from "../models/modelsRelations"
import { CustomError } from './customError'

export const getWishListItems = async function getWishListItems(userID: number): Promise<any> {
  try {

    const wishList = await models.wishListModel.findAll({
      attributes: [],
      include: [{
        model: models.productModel,
        attributes: ['title', 'subTitle', 'price', 'quantity'],
      }],
      where: {
        userID: userID,
      }
    })
    if (wishList.length > 0) {
      return (wishList)
    } else {
      throw new CustomError('No wishList Found for user', 404)

    }

  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const isAdedToWishList = async function isAdedToWishlist(userID: any, productID: number): Promise<number> {
  const isAdded = await models.wishListModel.findOne({
    where: {
      userID: userID,
      productID: productID
    }
  })
  if (isAdded) return 1
  else return 0
}

export const toggleWishlistItem = async (userID: number, productID: any) => {
  try {
    const isAdded = await isAdedToWishList(userID, productID)

    if (isAdded) {
      await models.wishListModel.destroy({ where: { userID: userID, productID: productID } })
      return 'Removed from wishlist'
    }

    const newWishlist = addToWishList(userID, productID)
    return { newWishlist }

  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const addToWishList = async function (userID: number, productID: number, transaction?: any) {
  try {
    const newWishlist = await models.wishListModel.create({
      userID: userID,
      productID: productID,
    }, { transaction })

    return newWishlist

  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}