import express from "express"
import { uploadPhoto, deletePhoto,getMyRatingsAndReviews, getUserProfile, updateUserProfile } from "../controllers/profileController";
import { sessionMiddleware } from "../middlewares/sessionMiddleware";
import { multerMiddleware } from "../middlewares/multerMiddleware";
const router = express.Router()




router.get("/",sessionMiddleware, getUserProfile)
router.get("/myReviews",sessionMiddleware, getMyRatingsAndReviews )
router.patch("/",sessionMiddleware, updateUserProfile)

const uploadImage = multerMiddleware('image');
router.post('/upload-photo', sessionMiddleware,uploadImage,uploadPhoto);
router.post('/delete-photo', sessionMiddleware, deletePhoto);


export default router;