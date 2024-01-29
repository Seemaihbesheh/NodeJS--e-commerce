import express from 'express'
const router = express.Router()
import { sessionMiddleware } from '../middlewares/sessionMiddleware'
import {getAddress} from '../controllers/addressController'

import {addressValidationSchema} from'../../models/address'
import {addressModel} from'../../models/modelsRelations'
const { ValidationError } = require('joi');


router.get('/',sessionMiddleware,getAddress)


  
export default router