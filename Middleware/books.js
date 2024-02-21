const { BookController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');

const getBooks = async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
  res.json(authors);
  if (!err) {
    res.json(authors);
  }
  return next(err);
};

const createBook = async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not created successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Created successfully' };
  res.json(responseData);
};

const updateBook = async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.update(req.params.id, req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not updated successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Updated successfully' };
  res.json(responseData);
};

const deleteBook = async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.deleteBook(req.params.id));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not delete successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Delete successfully' };
  res.json(responseData);
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
