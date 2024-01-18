import { userModel } from "./user"
import { sessionModel } from "./session"
import { cartModel } from "./cart"
import { wishListModel } from "./wishList"
import { ratingModel } from "./rating"
import { orderModel } from "./order"
import { addressModel } from "./address"
import { orderItemModel } from "./orderItem"
import { productModel } from "./product"
import { imageModel } from "./images"
import { brandModel } from "./brand"
import { categoryModel } from "./category"

userModel.hasMany(sessionModel, { foreignKey: 'userID' })
sessionModel.belongsTo(userModel, { foreignKey: 'userID' })

userModel.hasMany(cartModel, { foreignKey: 'userID' })
cartModel.belongsTo(userModel, { foreignKey: 'userID' })

userModel.hasMany(wishListModel, { foreignKey: 'userID' })
wishListModel.belongsTo(userModel, { foreignKey: 'userID' })

userModel.hasMany(ratingModel, { foreignKey: 'userID' })
ratingModel.belongsTo(userModel, { foreignKey: 'userID' })

userModel.hasMany(addressModel, { foreignKey: 'userID' })
addressModel.belongsTo(userModel, { foreignKey: 'userID' })


userModel.hasMany(orderModel, { foreignKey: 'userID' })
orderModel.belongsTo(userModel, { foreignKey: 'userID' })

orderModel.hasMany(orderItemModel, { foreignKey: 'orderID' })
orderItemModel.belongsTo(orderModel, { foreignKey: 'orderID' })

productModel.hasMany(imageModel, { foreignKey: 'productID' })
imageModel.belongsTo(productModel, { foreignKey: 'productID' })

productModel.hasMany(ratingModel,{ foreignKey: 'productID' })
ratingModel.belongsTo(productModel,{ foreignKey: 'productID' })

cartModel.hasMany(productModel, { foreignKey: 'productID' })
productModel.belongsTo(cartModel, { foreignKey: 'productID' })

wishListModel.hasMany(productModel, { foreignKey: 'productID' })
productModel.belongsTo(wishListModel, { foreignKey: 'productID' })

brandModel.hasMany(productModel, { foreignKey: 'brandID' })
productModel.belongsTo(brandModel, { foreignKey: 'brandID' })

categoryModel.hasMany(productModel,{foreignKey: 'categoryID'})
productModel.belongsTo(categoryModel, { foreignKey: 'categoryID' })

export {
    userModel, 
    sessionModel, 
    cartModel, 
    wishListModel, 
    ratingModel, 
    addressModel, 
    orderModel, 
    orderItemModel, 
    productModel, 
    imageModel,
    categoryModel
}
// user has many sessions
// user has many carts
// user has many wishlists
// user has many ratings
// user has many orders
// user has many addresses

// order has many items

// product has many images
// product has many ratings

// wishlist has many products

// cart has many products

// category has many products
// brand has many products