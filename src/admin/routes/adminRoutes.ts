import express from 'express'
const router = express.Router()

import ordersRoutes from './orderRoutes'
import usersRoutes from './userRoutes'
import productsRoutes from "./productRoutes"

router.use('/orders', ordersRoutes)
router.use('/users', usersRoutes)
router.use('/products',productsRoutes)

export default router