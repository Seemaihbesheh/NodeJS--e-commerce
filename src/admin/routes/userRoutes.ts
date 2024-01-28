import express from 'express'
import { allUsers } from '../controllers/userController'


const router = express.Router()

router.get('/get-users', allUsers)

export default router