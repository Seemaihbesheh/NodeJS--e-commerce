import express from 'express'
import * as cartController from '../controllers/cartController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
const router = express.Router()

router.get('/', sessionMiddleware, cartController.getCartContent)
router.put('/:productID', sessionMiddleware, cartController.updateProductQuantityInCart)
router.post('/move-to-wishList/:productID', sessionMiddleware, cartController.moveToWishlist)
router.post('/', sessionMiddleware, cartController.addToCart)
router.delete('/:productID', sessionMiddleware, cartController.deleteProductFromCart)

export default router

