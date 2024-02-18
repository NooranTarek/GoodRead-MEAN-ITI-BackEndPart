const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  cover: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  rating: {
    countOfRating: Number,
    valueOfRating: Number,
  },
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
