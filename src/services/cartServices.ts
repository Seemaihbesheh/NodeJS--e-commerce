import * as models from "../models/modelsRelations"
import * as wishListServices from './wishlistServices'
import * as productServices from './productServices'
import { CustomError } from './customError'

export const getCartContent = async function (userID: number): Promise<any> {
  try {
    return await models.cartModel.findAll({
      attributes: ["productQuantity"],
      where: {
        userID,
        isOrdered: false,
      },
      include: [
        {
          model: models.productModel,
          attributes: ["productID", "title", "subTitle", "price", "quantity", "discount"],
          include: [
            {
              model: models.imageModel,
              attributes: ["imgPath"],
              where: { position: 1 },
              required: false,
            },
          ],
        },
      ],
    })
  } catch (error) {
    error.status = 500
    error.message = 'Internal Server Error'
    throw error
  }
}

export const updateProductQuantityInCart = async function (userID: number, productID: number, newQuantity: number): Promise<any> {
  try {
    const product = await productServices.getProduct(productID)

    if (!product) {
      throw new CustomError('Product does not exist', 404)
    }

    if (product.quantity < newQuantity) {
      throw new CustomError('No enough quantity', 404)
    }

    const cartProduct = await models.cartModel.findOne({
      where: {
        userID: userID,
        productID: productID,
        isOrdered: 0,
      },
    })

    if (cartProduct) {
      return await updateProduct(cartProduct.productID, userID, newQuantity)
    } else {
      throw new CustomError('Product not found in the user\'s cart.', 404)
    }
  } catch (error) {
    throw error
  }
}

export const moveToWishlist = async function (userID: number, productID: number): Promise<any> {
  try {
    const productInCart = await models.cartModel.findOne({ where: { userID: userID, productID: productID } })

    if (productInCart) {
      const isProductInWishlist = await wishListServices.isAdedToWishList(userID, productID)

      if (isProductInWishlist) {
        throw new CustomError('Product Already in the wishList', 404)
      }

      const removedFromCart = await models.cartModel.destroy({ where: { userID: userID, productID: productID } })

      if (removedFromCart) {
        return await models.wishListModel.create({
          userID: userID,
          productID: productID,
        })
      }
    }
    throw new CustomError('Product not Added To the Cart', 404)
  } catch (error) {
    console.log
    throw error
  }
}

export const deleteProductFromCart = async function (userID: number, productID: number): Promise<any> {
  try {
    const product = await productServices.getProduct(productID)

    if (!product) {
      throw new CustomError('Product does not exist', 404)
    }

    await models.cartModel.destroy({
      where: {
        userID: userID,
        productID: productID,
        isOrdered: 0,
      },
    });

    return 'Deleted successfully'
  } catch (error) {
    throw error
  }
}

export const addToCart = async function (userID: number, productID: number, productQuantity: number) {
  try {
    const product = await productServices.getProduct(productID)

    if (!product) {
      throw new Error('Product does not exist')
    }

    if (product.quantity < productQuantity) {
      throw new Error('Not enough quantity')
    }

    const productExist = await models.cartModel.findOne({
      where: {
        productID: productID,
        userID: userID,
      },
    })

    if (productExist) {
      return await updateProduct(productExist.productID, userID, productExist.productQuantity + productQuantity)
    } else {
      const newCart = {
        userID: userID,
        productID: productID,
        productQuantity: productQuantity,
        isOrdered: 0,
      }

      const result = await models.cartModel.create(newCart)
      return 'Successfully added to cart'
    }
  } catch (error) {
    throw error
  }
}

async function updateProduct(cartProductID: number, userID: number, newQuantity: number) {
  try {
    return await models.cartModel.update({ productQuantity: newQuantity },
      {
        where: {
          productID: cartProductID,
          userID: userID,
        },
      })
  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}