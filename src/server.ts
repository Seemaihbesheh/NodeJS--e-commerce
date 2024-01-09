import express from 'express'
import bodyParser from 'body-parser'
import { syncModels } from './config/db'

const app = express()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

syncModels()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
  });