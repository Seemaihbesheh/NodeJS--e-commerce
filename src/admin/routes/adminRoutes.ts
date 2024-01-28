import express from 'express';
import multer from 'multer';
import { allUsers} from '../controllers/adminController';


const router = express.Router();

router.get('/get-users' ,allUsers);


export default router;
