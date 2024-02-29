const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewsSchema = Schema({
  id: {
    type: Number,
    unique: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  content: { type: String, required: true },
});
reviewsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const reviews = await this.constructor.find().sort({ id: -1 });
    if (reviews.length === 0) this.id = 1;
    else this.id = reviews[0].id + 1;
  }
  next();
});

reviewsSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
