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
  let authros;
  // get authors pagination
  if (!query.popular) {
    authros = await Book.find().limit(paginationNum).skip((query.pageNum - 1) * paginationNum)
      .exec()
      .catch((err) => err);
  }
  return authros;
};

// 2-create author

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  await Author.create(data)
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};

// 3-update author

const update = async (id, data) => {
  await Author.findOneAndUpdate({ _id: id }, data)
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};

// 4-delete author

const deleteBook = async (id) => {
  await Author.deleteOne({ _id: id })
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
