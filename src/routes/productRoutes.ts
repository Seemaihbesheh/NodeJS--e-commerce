import express from 'express'
const router = express.Router()
import * as productControllers from '../controllers/productController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'


router.get('/trendy', getTrendyProducts)
router.get("/category/:category" ,getProductsByCategory)
router.get("/brand/:brand" ,getProductsByBrand)
router.get("/newArrival" ,getNewArrivalProducts)
router.get("/limited", getLimitedProducts)
router.get("/discount/:discount", getProductsByDiscoutOrMore)


router.get('/handpicked',handPicked);
router.get('/:productID' , getSpecificProduct);
router.post('/rate/:productID',sessionMiddleware,rateProduct);
router.get('/ratings-and-reviews/:productID', getRateAndReview)

router.get('/search', productControllers.searchProduct)

export default router
