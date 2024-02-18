const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewsSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  content: { type: String, required: true },
});

reviewsSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
