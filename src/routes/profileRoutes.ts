import express from "express"
import { getMyRatingsAndReviews, getUserProfile, updateUserProfile } from "../controllers/profileController";
import { sessionMiddleware } from "../middlewares/sessionMiddleware";

const router = express.Router()

router.get("/",sessionMiddleware, getUserProfile)
router.get("/myReviews",sessionMiddleware, getMyRatingsAndReviews )
router.patch("/",sessionMiddleware, updateUserProfile)

export default router;