import express from 'express'
import bodyParser from 'body-parser'
import { syncModels } from './config/db'
import authenticationRoutes from './customer/routes/authenticationRoutes'
import productRoutes from './customer/routes/productRoutes'
import cartRoutes from './customer/routes/cartRoutes'
import wishListRoutes from './customer/routes/wishListRoutes'
import orderRoutes from './customer/routes/orderRoutes'
import profileRoutes from './customer/routes/profileRoutes'
import adminRoutes from './admin/routes/adminRoutes'
import {fillTables} from './utils/seedsFaker'

import cors from 'cors'
//fillTables
const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', authenticationRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes )
app.use('/wishList', wishListRoutes)
app.use("/profile", profileRoutes )
app.use('/orders', orderRoutes)

app.use('/admin', adminRoutes)

syncModels()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });
