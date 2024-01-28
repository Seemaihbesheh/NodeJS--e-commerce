import express from 'express'
const router = express.Router()
import * as productControllers from '../controllers/productController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'


router.get('/trendy', productControllers.getTrendyProducts)
router.get('/category/:category', productControllers.getProductsByCategory)
router.get('/brand/:brand', productControllers.getProductsByBrand)
router.get('/new-arrival', productControllers.getNewArrivalProducts)
router.get('/limited', productControllers.getLimitedProducts)
router.get('/discount/:discount', productControllers.getProductsByDiscoutOrMore)


router.get('/handpicked', productControllers.handPicked)
router.get('/product', productControllers.getSpecificProduct)
router.post('/rate/:productID', sessionMiddleware, productControllers.rateProduct)
router.get('/ratings-and-reviews/:productID', productControllers.getRateAndReview)

router.get('/search', productControllers.searchProduct)

export default router