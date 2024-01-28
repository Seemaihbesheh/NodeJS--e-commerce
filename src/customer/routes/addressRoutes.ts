import express from 'express'
const router = express.Router()
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import {getUserAddresses} from '../controllers/addressController'


router.get('/', sessionMiddleware, getUserAddresses)


export default router