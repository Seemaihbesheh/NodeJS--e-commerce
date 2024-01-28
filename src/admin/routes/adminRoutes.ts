import express from 'express'
const router = express.Router()

import ordersRoutes from './orderRoutes'
import usersRoutes from './userRoutes'

router.use('/orders', ordersRoutes)
router.use('/users', usersRoutes)

export default router