/* eslint-disable max-len */
const router = require('express').Router();
const { CategoryController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');

// isAuth, allowedTo("admin"),
router.post('/', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(
    CategoryController.addCategory(req.body),
  );
  if (!err) {
    res.json({ message: 'Category addedd successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

// isAuth, allowedTo("admin"),
router.patch('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  // eslint-disable-next-line max-len
  const [err, data] = await asyncWrapper(
    CategoryController.updateCategory(req.body, req.params.id),
  );
  if (!err) {
    res.json({ message: 'Category updated successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

//  isAuth, allowedTo("admin"),
router.delete('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(
    CategoryController.deleteCategory(req.params.id),
  );
  if (!err) {
    res.json({ message: 'Category deleted successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.get('/popularCategories', async (req, res, next) => {
  const [err, popularCategories] = await asyncWrapper(
    CategoryController.getPopularCategories(),
  );
  if (err) next(new AppError(err.message, 400));
  res.json({ popularCategories });
});

router.get('/', async (req, res, next) => {
  const [err, categories] = await asyncWrapper(
    CategoryController.getAllCategories(),
  );
  if (err) next(new AppError(err.message, 400));
  res.json({ categories });
});

router.get('/categoriesName',isAuth, allowedTo("user"), async (req, res, next) => {
  const [err, categories] = await asyncWrapper(
    CategoryController.categoriesName(),
  );
  if (err) next(new AppError(err.message, 400));
  res.json({ categories });
});

router.get('/:id',isAuth, allowedTo("user"), async (req, res, next) => {
  const categoryId = req.params.id;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 5;
  const [err, categories] = await asyncWrapper(
    CategoryController.booksForSpecificCategory(categoryId, page, pageSize),
  );
  if (err) next(new AppError(err.message, 400));
  else {
    res.json({ categories });
  }
});

router.get('', async (req, res, next) => {
  let category;
  if (req.params.id) {
    const cat = await asyncWrapper(CategoryController.getCategoryByObjId(req.params.id));
    category = cat;
  } else if (req.query.id) {
    const cat = await asyncWrapper(CategoryController.getCategoryById(req.query.id));
    category = cat;
  }
  if (category) {
    res.json({ category });
  } else {
    next(new AppError('Category not found', 404));
  }
});

module.exports = router;
