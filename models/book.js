const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = Schema({
  title: {
    type: String, required: true, maxLength: 30, minLength: 10,
  },
  description: {
    type: String, required: true, maxLength: 200, minLength: 10,
  },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  image: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId, ref: 'Category', required: true, unique: true,
  },
  valueOfRating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 0,
  },
  countOfRating: { type: Number },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  shelve: {
    type: String,
    enum: ['read', 'want to read', 'reading'],
    default: 'want to read',
  },
});

bookSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
