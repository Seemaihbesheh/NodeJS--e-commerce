import express from 'express'
const router = express.Router()
import * as productControllers from '../controllers/productController'
import { optionalAutorization, sessionMiddleware } from '../middlewares/sessionMiddleware'

router.get('/trendy',optionalAutorization, productControllers.getTrendyProducts)
router.get('/category/:category', optionalAutorization, productControllers.getProductsByCategory)
router.get('/brand/:brand', optionalAutorization, productControllers.getProductsByBrand)
router.get('/new-arrival', optionalAutorization, productControllers.getNewArrivalProducts)
router.get('/limited', optionalAutorization, productControllers.getLimitedProducts)
router.get('/discount', optionalAutorization, productControllers.getProductsByDiscoutOrMore)


router.get('/handpicked', optionalAutorization, productControllers.handPicked)
router.get('/product', productControllers.getSpecificProduct)
router.post('/rate/:productID', sessionMiddleware, productControllers.rateProduct)
router.get('/ratings-and-reviews/:productID', productControllers.getRateAndReview)

router.get('/search', productControllers.searchProduct)

export default router