import express from 'express'
import bodyParser from 'body-parser'
import { syncModels } from './config/db'
import userRoutes from './controllers/authenticationController'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'
import wishListRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import profileRoutes from './routes/profileRoutes'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes )
app.use('/wishList', wishListRoutes)
app.use("/profile", profileRoutes )
app.use('/orders', orderRoutes)

syncModels()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });
