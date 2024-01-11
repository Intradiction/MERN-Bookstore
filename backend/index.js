import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/bookRoutes.js";

const app = express();
app.use(express.json());
app.use('/books', booksRoute);


// Connect to MongoDB, then if connection successful, start express server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database')
    app.listen(PORT, () => { 
      console.log(`App is listening on port: ${PORT}`);
    });    
  })
  .catch((error) => {
    console.log(error)
  })