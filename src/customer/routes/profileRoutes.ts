import express from "express"
import * as profileController from "../controllers/profileController";
import { sessionMiddleware } from "../middlewares/sessionMiddleware";
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', sessionMiddleware, profileController.getUserProfile)
router.get('/myReviews', sessionMiddleware, profileController.getMyRatingsAndReviews)
router.patch('/', sessionMiddleware, profileController.updateUserProfile)

router.post('/upload-photo', sessionMiddleware, upload.single('image'), profileController.uploadPhoto)
router.post('/delete-photo', sessionMiddleware, profileController.deletePhoto)



export default router