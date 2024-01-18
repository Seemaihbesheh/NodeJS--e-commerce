import express, { Request, Response } from 'express'
import { getCart, updateProductQuantityInCart, moveToWishlist } from '../controllers/cartController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
const router = express.Router()

router.get('/', sessionMiddleware, getCart)
router.put('/:productID', sessionMiddleware, updateProductQuantityInCart)
router.post('/moveToWishList/:productID', sessionMiddleware, moveToWishlist)

export default router

