const router = require('express').Router();
const { CategoryController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');

router.post('/', async (req, res, next) => {
  const [err, data] = await asyncWrapper(CategoryController.addCategory(req.body));
  if (!err) {
    res.json({ message: 'Category addedd successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.patch('/:id', async (req, res, next) => {
  // eslint-disable-next-line max-len
  const [err, data] = await asyncWrapper(CategoryController.updateCategory(req.body, req.params.id));
  if (!err) {
    res.json({ message: 'Category updated successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.delete('/:id', async (req, res, next) => {
  const [err, data] = await asyncWrapper(CategoryController.deleteCategory(req.params.id));
  if (!err) {
    res.json({ message: 'Category deleted successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});
module.exports = router;
