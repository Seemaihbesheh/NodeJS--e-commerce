import { Router } from 'express'
import * as authenticationController from '../controllers/authenticationController'
import { sessionMiddleware } from '../middlewares/sessionMiddleware'

const router = Router()

router.post('/signup', authenticationController.signUp)
router.post('/login', authenticationController.login)
router.post('/changePassword',sessionMiddleware, authenticationController.changePassword)
router.delete('/logout',sessionMiddleware, authenticationController.logout)

export default router