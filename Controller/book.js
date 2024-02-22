/* eslint-disable no-underscore-dangle */
const Book = require('../models/book');
const Review = require('../models/review');
const AppError = require('../lib/appError');

const { paginationNum } = process.env;

// 1-get books

const getBooks = async (query) => {
  // /book?pageNum=1&popular=(true or false)
  // get books pagination
  const books = await Book.find()
    .limit(paginationNum)
    .skip((query.pageNum - 1) * paginationNum)
    .populate('category')
    .populate('author')
    .populate('reviews')
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return books;
};
// get popular book
const getPopularBooks = async () => {
  const books = await Book.find()
    .sort({ countOfRating: -1 })
    .limit(paginationNum)
    .populate('category')
    .populate('author')
    .populate('reviews')
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return books;
};

// eslint-disable-next-line max-len
// get specific book filter by shelve value sended in query params book/shelve?pageNum=1&shelve=want%20to%20read
const getBooksFilterByShelve = async function (query) {
  const pageNum = query.pageNum || 1;
  const shelve = query.shelve || '';
  const pagination = Number(paginationNum) || 100;
  const books = await Book.aggregate([
    { $match: { shelve } },
    { $limit: pagination },
    {
      $lookup: {
        from: 'authors',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },
    {
      $project: {
        id: 1,
        title: 1,
        image: 1,
        valueOfRating: 1,
        countOfRating: 1,
        shelve: 1,
        author: {
          fullName: { $concat: ['$author.firstName', ' ', '$author.lastName'] },
        },
      },
    },
    { $skip: (pageNum - 1) * paginationNum },
  ]).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return books;
};

// get book by id
const getBookById = async (id) => {
  const book = await Book.findOne({ _id: id }).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};

// 2-create book

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  const book = await Book.create(data).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};

// 3-update book

const update = async (id, data) => {
  const book = await Book.findOneAndUpdate({ _id: id }, data).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};

// 4-delete book

const deleteBook = async (id) => {
  const book = await Book.findOneAndDelete({ _id: id }).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};
module.exports = {
  getBooks,
  create,
  update,
  deleteBook,
  getPopularBooks,
  getBooksFilterByShelve,
  getBookById,
};
