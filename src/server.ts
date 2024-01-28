import express from 'express'
import bodyParser from 'body-parser'
import { syncModels } from './config/db'
import userRoutes from './custmer/controllers/authenticationController'
import productRoutes from './custmer/routes/productRoutes'
import cartRoutes from './custmer/routes/cartRoutes'
import wishListRoutes from './custmer/routes/wishListRoutes'
import addressRoutes from './custmer/routes/addressRoutes'
import orderRoutes from './custmer/routes/orderRoutes'
import profileRoutes from './custmer/routes/profileRoutes'
import adminRoutes from './admin/routes/adminRoutes'

import cors from 'cors'

import {fillTables} from './models/seedsFaker'
//fillTables();

const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//user
app.use('/', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes )
app.use('/wishList', wishListRoutes)
app.use("/profile", profileRoutes )
app.use('/orders', orderRoutes)
app.use('/address',addressRoutes )

//admin
app.use('/admin',adminRoutes)


syncModels()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });
