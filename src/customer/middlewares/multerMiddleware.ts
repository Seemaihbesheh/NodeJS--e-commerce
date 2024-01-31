import multer from 'multer';
import { CustomRequest } from "../middlewares/sessionMiddleware";

interface MulterRequest extends  CustomRequest {
  file: {
    buffer: Buffer;
  };
}

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

const multerMiddleware = (fieldName: string) => {
  return upload.single(fieldName);
};

export { multerMiddleware, MulterRequest };
