/* eslint-disable no-underscore-dangle */
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const Review = require('../models/review');
const Category = require('../models/category');
const CustomError = require('../lib/appError');

const { paginationNum } = process.env || 30;

// 1-get books

const getBooks = async (query) => { // /author?pageNum=1,popular=(true or false)
  let books;
  // get authors pagination
  if (!query.popular) {
    books = await Book.find().limit(paginationNum).skip((query.pageNum - 1) * paginationNum)
      .exec()
      .catch((err) => err);
    return books;
  }

  return books;
};

// 2-create author

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  await Book.create(data)
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};

// 3-update author

const update = async (id, data) => {
  await Book.findOneAndUpdate({ _id: id }, data)
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};

// 4-delete author

const deleteBook = async (id) => {
  await Book.deleteOne({ _id: id })
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};
module.exports = {
  getBooks,
  create,
  update,
  deleteBook,
};
