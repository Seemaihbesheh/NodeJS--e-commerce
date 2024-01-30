import express from 'express'
const router = express.Router();
import * as wishListController from '../controllers/wishListController'
import {sessionMiddleware} from "../middlewares/sessionMiddleware"

router.get('/', sessionMiddleware, wishListController.getWishList)

router.post('/:productID', sessionMiddleware, wishListController.toggleWishlist)

export default router