import express from "express"
import { uploadPhoto, deletePhoto,getMyRatingsAndReviews, getUserProfile, updateUserProfile } from "../controllers/profileController";
import { sessionMiddleware } from "../middlewares/sessionMiddleware";
import multer from 'multer';

const router = express.Router()
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });


router.get("/",sessionMiddleware, getUserProfile)
router.get("/myReviews",sessionMiddleware, getMyRatingsAndReviews )
router.patch("/",sessionMiddleware, updateUserProfile)


router.post('/upload-photo', sessionMiddleware, upload.single('image'), uploadPhoto);
router.post('/delete-photo', sessionMiddleware, deletePhoto);


export default router;