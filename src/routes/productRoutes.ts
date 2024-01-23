import express, { Request, Response } from 'express'
const router = express.Router()
import {getLimitedProducts, getNewArrivalProducts, getProductsByBrand, getProductsByCategory, getProductsByDiscoutOrMore,getTrendyProducts,rateProduct,getRateAndReview,getSpecificProduct,handPicked } from '../controllers/productController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'


router.get('/trendy', getTrendyProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/brand/:brand', getProductsByBrand)
router.get('/new-arrival', getNewArrivalProducts)
router.get('/limited', getLimitedProducts)
router.get('/discount/:discount', getProductsByDiscoutOrMore)


router.get('/handpicked', handPicked)
router.get('/:productID', getSpecificProduct)
router.post('/rate/:productID', sessionMiddleware,rateProduct)
router.get('/ratings-and-reviews/:productID', getRateAndReview)



export default router
