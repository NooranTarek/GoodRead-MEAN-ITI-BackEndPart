const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String, required: true, maxLength: 30, minLength: 10,
  },
  description: {
    type: String, required: true, maxLength: 200, minLength: 10,
  },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  image: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId, ref: 'Category', required: true,
  },
  valueOfRating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  countOfRating: { type: Number, default: 0 },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  shelve: {
    type: String,
    enum: ['read', 'want to read', 'reading'],
    default: 'want to read',
  },
});

bookSchema.pre('save', async function (next) {
  if (this.isNew) {
    const books = await this.constructor.find().sort({ id: -1 });
    if (books.length === 0) this.id = 1;
    else this.id = books[0].id + 1;
  }
  next();
});
bookSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
