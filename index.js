const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://nourantareqmohamed:HHvw8soG2oa2mok7@nouranscluster0.4zfzjbg.mongodb.net/goodReads').then(() => {
  console.error('Connecting sucessfully');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const PORT = process.env.PORT || 3000;

const dotenv = require('dotenv');
// const AppError = require('./lib/appError');

dotenv.config();
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).json({ error: err.message });
/*= ======
  // Check if the error is an instance of AppError
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
  } else {
    // return a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
*/
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
