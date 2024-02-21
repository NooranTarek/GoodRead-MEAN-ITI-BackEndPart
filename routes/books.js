const router = require('express').Router();
const { BookController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');

router.get('/', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

router.post('/', async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not created successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Created successfully' };
  res.json(responseData);
});

router.patch('/:id', isAuth, async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.update(req.params.id, req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not updated successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Updated successfully' };
  res.json(responseData);
});

router.delete('/:id', async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.deleteBook(req.params.id));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not delete successfully', 422));
  }
  const responseData = { ...data.toObject(), message: 'Delete successfully' };
  res.json(responseData);
});
module.exports = router;
