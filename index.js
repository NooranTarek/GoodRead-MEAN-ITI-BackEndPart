/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const AppError = require('./lib/appError');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
};

// app.use(cors(corsOptions));
app.use(cors());
mongoose
  .connect(
    'mongodb+srv://nourantareqmohamed:HHvw8soG2oa2mok7@nouranscluster0.4zfzjbg.mongodb.net/goodReads',
  )
  .then(() => {
    console.error('Connecting sucessfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const PORT = process.env.PORT || 3000;

// const AppError = require('./lib/appError');

dotenv.config();
app.use(express.json());
app.use(routes);
app.use(express.static('public'));

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
  } else {
    // return a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
