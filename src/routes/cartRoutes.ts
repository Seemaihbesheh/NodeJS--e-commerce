import express, { Request, Response } from 'express'
import { getCart, updateProductQuantityInCart, moveToWishlist, addToCart, deleteProductFromCart } from '../controllers/cartController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
const router = express.Router()

router.get('/', sessionMiddleware, getCart)
router.put('/:productID', sessionMiddleware, updateProductQuantityInCart)
router.post('/moveToWishList/:productID', sessionMiddleware, moveToWishlist)
router.post("/" , sessionMiddleware, addToCart);
router.delete("/:productID" , sessionMiddleware, deleteProductFromCart);

export default router

