import express from 'express'
const router = express.Router()
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import {getAddress} from '../controllers/addressController'


router.get('/',sessionMiddleware,getAddress)


export default router