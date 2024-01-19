import express, { Request, Response } from 'express'
const router = express.Router()
import {getLimitedProducts, getNewArrivalProducts, getProductsByBrand, getProductsByCategory, getProductsByDiscoutOrMore, getTrendyProducts} from '../controllers/productController'


router.get('/trendy', getTrendyProducts)
router.get("/category/:category" ,getProductsByCategory)
router.get("/brand/:brand" ,getProductsByBrand)
router.get("/newArrival" ,getNewArrivalProducts)
router.get("/limited", getLimitedProducts)
router.get("/discount/:discount", getProductsByDiscoutOrMore)

export default router