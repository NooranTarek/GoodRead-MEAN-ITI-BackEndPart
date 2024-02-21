/* eslint-disable no-underscore-dangle */
const dotenv = require('dotenv');
const Book = require('../models/book');
const Author = require('../models/author');
const AppError = require('../lib/appError');

dotenv.config();
const { paginationNum } = process.env || 100;

// 1-get authors

const getAuthors = async (query) => { // author?pageNum=1,popular=(true or false)
  let authros;

  // get all authors pagination
  if (!query.popular) {
    authros = await Author.find().limit(paginationNum).skip((query.pageNum - 1) * paginationNum)
      .catch((err) => {
        throw new AppError(err.message, 400);
      });
    return authros;
  }
  // get popular authors that have the heighest num of books / apply pagination also
  authros = await Book.aggregate([
    {
      $group: {
        _id: '$author',
        totalBooks: { $sum: 1 },
      },
    },
    { $sort: { $totalBooks: -1 } },
    // { $skip: (query.pageNum - 1) * paginationNum },
    { $limit: paginationNum },
  ])
    .catch((err) => {
      throw new AppError(err.message, 400);
    });
  return authros;
};

// 2-create author

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  const author = await Author.create(data)
    .catch((err) => {
      throw new AppError(err.message, 400);
    });
  return author;
};

// 3-update author

const update = async (id, data) => {
  const author = await Author.findOneAndUpdate({ _id: id }, data)
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return author;
};

// 4-delete author

const deleteAthor = async (id) => {
  const author = await Author.findOneAndDelete({ _id: id })
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return author;
};
module.exports = {
  getAuthors,
  create,
  update,
  deleteAthor,
};
