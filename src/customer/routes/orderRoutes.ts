import express from 'express'
const router = express.Router()

import * as orderController from '../controllers/orderController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'

router.get('/', sessionMiddleware, orderController.getUserOrders)
router.get('/order', orderController.getSpecificOrder)
router.post('/', sessionMiddleware, orderController.placeOrder)

export default router