import express from 'express'
const router = express.Router()

import { getSpecificOrder } from '../controllers/orderControllers'


router.get('/order', getSpecificOrder)

export default router