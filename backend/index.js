import express, { response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';
import { PORT } from "./config.js";
import booksRoute from "./routes/bookRoutes.js";

const app = express();

// Middleware for parsing JSON request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(
  //cors()
  cors({
    origin: ['https://mern-bookstore-frontend-eight.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use('/books', booksRoute);

// Default route, if people visit backend url in browser
app.get('/', (request, response) => {
  response.status(200).send('Backend for MERN bookstore');
});

// if you visit the backend url in a browser, it'll try to get the icon for the tab , tell em no - there's no icon here buddy
app.get('/favicon.ico', (request, response) => {
  response.status(204).end();  // 204 no content
});


// Connect to MongoDB, then if connection successful, start express server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('App connected to database')
    app.listen(PORT, () => { 
      console.log(`App is listening on port: ${PORT}`);
    });    
  })
  .catch((error) => {
    console.log(error)
  })

export default app;