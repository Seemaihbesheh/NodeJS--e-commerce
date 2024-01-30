import express from "express"
import * as profileController from "../controllers/profileController";
import { sessionMiddleware } from "../middlewares/sessionMiddleware";
import { multerMiddleware } from "../middlewares/multerMiddleware";

const router = express.Router()

router.get('/', sessionMiddleware, profileController.getUserProfile)
router.get('/myReviews', sessionMiddleware, profileController.getMyRatingsAndReviews)
router.patch('/', sessionMiddleware, profileController.updateUserProfile)


const uploadImage = multerMiddleware('image');
router.post('/upload-photo', sessionMiddleware,uploadImage,profileController.uploadPhoto);
router.post('/delete-photo', sessionMiddleware, profileController.deletePhoto)



export default router