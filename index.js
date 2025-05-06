
import express from 'express';
import mongoose from 'mongoose';
import auth from './Routes/authRoutes.js';

const app = express();

app.use(express.json());


const port = 5000;


mongoose.connect('mongodb+srv://DipenDra:Dipendra123@cluster0.h9oaq.mongodb.net/PL1').then((val) => {
  app.listen(port, () => {
    console.log(`Connected to MangoDb and server is running on port : ${port}`);
  })
}).catch((err) => {
  console.log("Error connection to mangoDb", err);
})

app.use('/api', auth);
