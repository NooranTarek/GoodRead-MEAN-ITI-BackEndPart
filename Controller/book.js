/* eslint-disable no-underscore-dangle */
const Book = require("../models/book");
const User = require("../models/user");
const Review = require("../models/review");
const Category = require("../models/category");
const AppError = require("../lib/appError");

const { paginationNum } = process.env;

// 1-get books

const getBooks = async (query) => {
  // /book?pageNum=1&popular=(true or false)
  let books;
  // get books pagination
  if (!query.popular) {
    books = await Book.find()
      .limit(paginationNum)
      .skip((query.pageNum - 1) * paginationNum)
      .exec()
      .catch((err) => err);
    return books;
  }
  books = await Book.find()
    .sort({ countOfRating: -1 })
    .limit(paginationNum)
    // .skip((query.pageNum - 1) * paginationNum)
    .populate("book")
    .populate("category")
    .populate("reviews");
  return books;
};

// get popular book
const getPopularBooks = async () => {
  // /book?pageNum=1,popular=(true or false)
  const books = await Book.find()
    .sort({ countOfRating: -1 })
    .limit(paginationNum)
    // .skip((query.pageNum - 1) * paginationNum)
    .populate("book")
    .populate("category")
    .populate("reviews");
  return books;
};

// eslint-disable-next-line max-len
// get specific book filter by shelve value sended in query params book/shelve?pageNum=1&shelve=want%20to%20read
const getBooksFilterByShelve = async (query) => {
  const books = await Book.find({ shelve: query.shelve })
    .limit(paginationNum)
    .populate("author")
    .skip((query.pageNum - 1) * paginationNum);
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
