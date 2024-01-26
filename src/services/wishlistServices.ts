import * as models from "../models/modelsRelations"

export const getWishListItems = async function getWishListItems(userID: number): Promise<any> {
  try {
    return await models.wishListModel.findAll({
      attributes: [],
      include: [{
        model: models.productModel,
        attributes: ['title', 'subTitle', 'price', 'quantity'],
      }],
      where: {
        userID: userID,
      }
    })
  } catch (error) {
    throw new Error('Internal Server Error')
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

    const newWishlist = await models.wishListModel.create({
      userID: userID,
      productID: productID,
    })

    return { newWishlist }

  } catch (error) {
    throw new Error('Internal Server Error')
  }
}