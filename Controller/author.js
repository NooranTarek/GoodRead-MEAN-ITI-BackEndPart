/* eslint-disable no-underscore-dangle */
const dotenv = require('dotenv');
const Book = require('../models/book');
const Author = require('../models/author');
const AppError = require('../lib/appError');
const { ObjectId } = require('mongoose').Types;

dotenv.config();
const { paginationNum } = process.env || 100;

// 1-get all authors for admin page sss

const getAuthors = async () => {
  // author?pageNum=1,popular=(true or false)
  const authros = await Author.find().catch((err) => {
    throw new AppError(err.message, 400);
  });
  return authros;
};

// 2-get all authors for user page

const getAuthorsPagination = async (query) => {
  // author?pageNum=1,popular=(true or false)
  const authros = await Author.find()
    .limit(paginationNum)
    .skip((query.pageNum - 1) * paginationNum)
    .catch((err) => {
      throw new AppError(err.message, 400);
    });
  return authros;
};

// 3-gell poplular authors for home page

const getPopularAuthors = async () => {
  const authors = await Book.aggregate([
    {
      $group: {
        _id: '$author',
        totalBooks: { $sum: 1 },
      },
    },
    {
      $sort: { totalBooks: -1 },
    },
    {
      $lookup: {
        from: 'authors',
        localField: '_id',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $unwind: '$authorDetails',
    },
    {
      $project: {
        _id: '$authorDetails._id',
        firstName: '$authorDetails.firstName',
        lastName: '$authorDetails.lastName',
        image: '$authorDetails.image',
      },
    },
    {
      $limit: 6,
    },
  ]).catch((err) => {
    throw new AppError(err.message, 400);
  });

  return authors;
};

// 4-get author by id

const getAuthorById = async (id) => {
  const authorId = new ObjectId(id);
  const books = await Book.aggregate([
    { $match: { author: authorId } },
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
          image: '$author.image',
          dob: '$author.dob',
          description: '$author.description',
        },
      },
    },
  ]).catch((err) => {
    throw new AppError(err.message, 422);
  });

  return books;
};

// 5-get specific author by id

const getSpecificAuther = async (authorId) => {
  const author = await Author.findById(authorId).select(
    '-_id firstName lastName image dob',
  );
  const books = await Book.find({ author: authorId })
    .select('-_id title image valueOfRating countOfRating')
    .catch((err) => {
      throw new AppError(err.message, 422);
    });
  return { author, books };
};

/// /////////////////////////////////////CRUD OPERATION/////////////////////////////////////

// 6-create author

const create = async (data) => {
  // eslint-disable-next-line no-param-reassign
  const author = await Author.create(data).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return author;
};

// 7-update author

const update = async (id, data) => {
  const author = await Author.findOneAndUpdate({ _id: id }, data).catch(
    (err) => {
      throw new AppError(err.message, 422);
    },
  );
  return author;
};

// 8-delete author

const deleteAthor = async (id) => {
  const author = await Author.findOneAndDelete({ _id: id }).catch((err) => {
    throw new AppError(err.message, 422);
  });
  return author;
};

module.exports = {
  getAuthors,
  create,
  update,
  deleteAthor,
  getPopularAuthors,
  getSpecificAuther,
  getAuthorById,
  getAuthorsPagination,
};
