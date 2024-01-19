import express, { Request, Response } from 'express'
const router = express.Router();
import {getWishList,toggleWishlist} from '../controllers/wishListController'
import {sessionMiddleware} from "../middlewares/sessionMiddleware"

router.get('/', sessionMiddleware, getWishList)

router.post('/:productID', sessionMiddleware, toggleWishlist)

export default router