import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Book } from "./models/bookModel.js";

const app = express();
app.use(express.json());

// Default route
app.get('/', (request, response) => {
  console.log(request);
  return response.status(200).send('MERN stack tutorial backend');
});

// Route to save new book
app.post('/books', async(request, response) => {
  try {
    if (!request.body.title || !request.body.author || !request.body.publishYear) {
      return response.status(400).send({message: 'Send all required fields: title, author, publishYear'});
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear, 
    }

    const book = await Book.create(newBook);
    return response.status(201).send(book);

  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get all books from database
app.get('/books', async(request, response) => {
  try {
    const books = await Book.find({});

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get a book by ID
app.get('/books/:id', async(request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);

    if(!book) {
      return response.status(404).json({ message: 'Book not found'});
    }

    return response.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to update a book by ID
app.put('/books/:id', async(request, response) => {
  try {
    if (!request.body.title || !request.body.author || !request.body.publishYear) {
      return response.status(400).send({message: 'Send all required fields: title, author, publishYear'});
    }

    const { id } = request.params;

    const book = await Book.findByIdAndUpdate(id, request.body);

    if(!book) {
      return response.status(404).json({ message: 'Book not found'});
    }

    return response.status(200).send({ message: 'Book updated successfully'})

  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to delete a book by ID
app.delete('/books/:id', async(request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Book not found'});
    }

    return response.status(200).send({ message: 'Book deleted successfully'});
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

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