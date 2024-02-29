/* eslint-disable no-param-reassign */
const Review = require('../models/review');
const AppError = require('../lib/appError');

// 1-get reviews for each book

const getBookReviews = async (bookId) => {
  console.log(bookId);
  // console.log(book);
  // const bookIdToFind = '65df24a617f4cbb1dd826bde';
  try {
    const reviews = await Review.find({ book: bookId }).populate('user').exec();
    return reviews;
  } catch (err) {
    console.log('here in error');
    throw new AppError(err.message, 422);
  }
};

// 2-create review
const createReview = async (userId, data, bookId) => {
  data.user = userId;
  data.book = bookId;
  const review = await Review.create(data).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return review;
};
module.exports = {
  getBookReviews,
  createReview,
};
