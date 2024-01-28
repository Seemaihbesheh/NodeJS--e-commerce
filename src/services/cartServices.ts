import * as models from "../models/modelsRelations"
import * as wishListServices from './wishlistServices'
import * as productServices from './productServices'
import { CustomError } from './customError'
import { sequelize } from "../config/db"

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
    throw new CustomError('Internal Server Error', 500)
  }
}

export const updateProductQuantityInCart = async function (userID: number, productID: number, newQuantity: number): Promise<any> {
  try {
    const product = await productServices.getProduct(productID)
    if (!product) {
      throw new CustomError('Product does not exist', 404)

    }
    if (product.quantity < newQuantity) {
      throw new CustomError('No enough quantity', 400)
    }

    const cartProduct = await findCartProduct(userID, productID)
    return await updateProductInCart(cartProduct.productID, userID, { productQuantity: newQuantity })

  } catch (error) {

    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const moveToWishlist = async function (userID: number, productID: number): Promise<any> {
  const transaction = await sequelize.transaction()

  try {
    const productInCart = await findCartProduct(userID, productID)

    if (productInCart) {
      const isProductInWishlist = await wishListServices.isAdedToWishList(userID, productID)

      if (isProductInWishlist) {
        throw new CustomError('Product Already in the wishList', 404)
      }

      await models.cartModel.destroy({ where: { userID: userID, productID: productID }, transaction: transaction })


      await wishListServices.addToWishList(userID, productID, transaction)

      await transaction.commit()
    }
    throw new CustomError('Product not Added To the Cart', 404)
  } catch (error) {
    await transaction.rollback()
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500);
    }
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
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500);
    }
  }
}

export const addToCart = async function (userID: number, productID: number, productQuantity: number) {
  try {
    const product = await productServices.getProduct(productID)

    if (!product) {
      throw new CustomError('Product does not exist', 404)
    }

    if (product.quantity < productQuantity) {
      throw new Error('Not enough quantity')
    }

    const productExist = await findCartProduct(userID, productID)

    if (productExist) {
      return await updateProductInCart(productExist.productID, userID, productExist.productQuantity + productQuantity)
    } else {
      const newCart = {
        userID: userID,
        productID: productID,
        productQuantity: productQuantity,
        isOrdered: 0,
      }

      const result = await models.cartModel.create(newCart)
      return result
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error
    } else {
      throw new CustomError('Internal Server Error', 500)
    }
  }
}

export const updateProductInCart = async function updateProductInCart(cartProductID: number, userID: number, updateData: { productQuantity?: number, isOrdered?: boolean }, transaction?: any) {
  try {
    const [updatedRowsCount] = await models.cartModel.update(updateData,
      {
        where: {
          productID: cartProductID,
          userID: userID,
        }, transaction: transaction
      })
    if (updatedRowsCount === 0) {
      throw new CustomError('product cannot be updated', 400)
    }

    const updatedProduct = await productServices.getProduct(cartProductID)

    return (updatedProduct)

  } catch (error) {
    throw new CustomError('Internal Server Error', 500)
  }
}

export const findCartProduct = async function (userID: number, productID: number): Promise<any> {
  try {
    return await models.cartModel.findOne({
      where: {
        userID: userID,
        productID: productID,
        isOrdered: 0,
      },
    })
  }
  catch (error) {
    throw new CustomError('Product not found in the user\'s cart.', 404)
  }
}