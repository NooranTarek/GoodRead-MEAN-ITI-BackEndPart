/* eslint-disable max-len */
const router = require('express').Router();
const { CategoryController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');

router.post('/', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(CategoryController.addCategory(req.body));
  if (!err) {
    res.json({ message: 'Category addedd successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.patch('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  // eslint-disable-next-line max-len
  const [err, data] = await asyncWrapper(CategoryController.updateCategory(req.body, req.params.id));
  if (!err) {
    res.json({ message: 'Category updated successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.delete('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(CategoryController.deleteCategory(req.params.id));
  if (!err) {
    res.json({ message: 'Category deleted successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.get('/popularCategories', async (req, res, next) => {
  const [err, popularCategories] = await asyncWrapper(CategoryController.getPopularCategories());
  if (err) next(new AppError(err.message, 400));
  res.json({ popularCategories });
});

router.get('/', async (req, res, next) => {
  const pageNum = req.query.pageNum ? (req.query.pageNum) : 1;
  const pageSize = 10; // Adjust as needed
  const [err, categories] = await asyncWrapper(CategoryController.getAllCategories(pageNum, pageSize));
  if (err) next(new AppError(err.message, 400));
  res.json({ categories });
});

router.get('/categoriesName', async (req, res, next) => {
  const [err, categories] = await asyncWrapper(CategoryController.categoriesName());
  if (err) next(new AppError(err.message, 400));
  res.json({ categories });
});

router.get('/:id', async (req, res, next) => {
  const [err, categories] = await asyncWrapper(CategoryController.booksForSpecificCategory(req.params.id));
  if (err) next(new AppError(err.message, 400));
  else {
    res.json({ categories });
  }
});
module.exports = router;
