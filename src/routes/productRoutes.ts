import express, { Request, Response } from 'express'
const router = express.Router()
import {getTrendyProducts} from '../controllers/productController'


router.get('/trendy', getTrendyProducts)

export default router