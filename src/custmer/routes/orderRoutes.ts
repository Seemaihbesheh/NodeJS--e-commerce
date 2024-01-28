import express from 'express'
const router = express.Router()
import { sessionMiddleware } from '../middlewares/sessionMiddleware'

import { getSpecificOrder ,getOrders} from '../controllers/orderControllers'

router.get('/',sessionMiddleware,getOrders)
router.get('/order', getSpecificOrder)

export default router