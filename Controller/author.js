/* eslint-disable no-underscore-dangle */
const dotenv = require('dotenv');
const Book = require('../models/book');
const Author = require('../models/author');
const CustomError = require('../lib/appError');

dotenv.config();
const { paginationNum } = process.env;

// 1-get authors

const getAuthors = async (query) => { // /author?pageNum=1,popular=(true or false)
  let authros;
  // get authors pagination
  console.log(paginationNum);
  console.log(query.pageNum);
  if (!query.popular) {
    authros = await Author.find().limit(paginationNum).skip((query.pageNum - 1) * paginationNum)
      .exec()
      .catch((err) => err);
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
    { $skip: (query.pageNum - 1) * paginationNum },
    { $limit: query.pageNum },
  ])
    .exec()
    .catch((err) => err);
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

const deleteAthor = async (id) => {
  await Author.deleteOne({ _id: id })
    .exec()
    .catch((err) => {
      throw new CustomError(err.message, 422);
    });
};
module.exports = {
  getAuthors,
  create,
  update,
  deleteAthor,
};
