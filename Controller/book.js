/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const Book = require('../models/book');
const User = require('../models/user');
const Review = require('../models/review');
const AppError = require('../lib/appError');

const { paginationNum } = process.env;

// 1-get books

const getBooks = async () => {
  const books = await Book.find()
    .populate('category')
    .populate('author')
    .populate('reviews')
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return books;
};
// 2-get books for pagination
const getBooksForPagination = async (query) => {
  // /book?pageNum=1
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

// 3- get popular book
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
// 4- get specific book filter by shelve value sended in query params book/shelve?pageNum=1&shelve=reading/read
const getBooksFilterByShelve = async (id, query) => {
  const { pageNum = 1, shelve } = query;
  const perPage = process.env.paginationNum || 10;

  // const user = await User.findById(id2)
  const user = await User.findById(id)
    .populate({
      path: 'books',
      populate: {
        path: 'idOfBook',
        model: 'Book',
        populate: {
          path: 'author',
          model: 'Author',
        },
      },
    })
    .exec()
    .catch((err) => {
      throw new AppError(err.message, 422);
    });

  const filteredBooks = shelve === 'all'
    ? user.books
    : user.books.filter((book) => book.shelf === shelve);

  const startIndex = (pageNum - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredBooks.length);

  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  return {
    count: filteredBooks.length,
    books: paginatedBooks,
  };
};

// 5-get book by id
const getBookById = async (id) => {
  const book = await Book.findOne({ id })
    .populate('author')
    .populate('category')
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return book;
};

// 6-create book

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  const book = await Book.create(data).catch((err) => {
    throw new AppError(err.message, 422);
  });

  return book;
};

// 7-update book

const update = async (id, data) => {
  const book = await Book.findOneAndUpdate({ id }, data).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};

// 8-update rating

const updateRating = async (id, newRating) => {
  const book = await Book.findOneAndUpdate(
    { _id: id },
    {
      $inc: { countOfRating: 1, totalRating: newRating },
    },
    { new: true },
  ).catch((err) => {
    throw new AppError(err.message, 422);
  });
  if (!book) {
    throw new AppError('Book not found', 404);
  }

  return book;
};

// 9-delete book

const deleteBook = async (id) => {
  const book = await Book.findOneAndDelete({ id }).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return book;
};

// 10-create review for bookk for specific user  .createReview(idOfUser,body(content), idOfBook)

const createReview = async (userId, data, bookId) => {
  data.user = userId;
  data.book = bookId;
  const review = await Review.create(data).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return review;
};
module.exports = {
  getBooks,
  create,
  update,
  deleteBook,
  getPopularBooks,
  getBooksFilterByShelve,
  getBookById,
  updateRating,
  getBooksForPagination,
  createReview,
};
