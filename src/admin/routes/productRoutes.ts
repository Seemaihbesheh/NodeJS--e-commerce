import express from 'express'
import * as productController from"../controllers/productController"

const router = express.Router()

router.post('/' , productController.addProduct)
router.patch('/:productID', productController.updateProduct)

export default router