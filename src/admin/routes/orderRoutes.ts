import express from 'express'
const router = express.Router()

import * as orderController from '../controllers/orderController'

router.get('/get-processing-orders', orderController.getProcessingOrders)
router.put('/update-order-status/:orderID', orderController.updateOrderStatus)

export default router