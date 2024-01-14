import express from 'express'
import bodyParser from 'body-parser'
import { syncModels } from './config/db'
import userRoutes from './controllers/authenticationController'
import productRoutes from './routes/productRoutes'

const app = express()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes)
app.use('/products', productRoutes)




syncModels()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });