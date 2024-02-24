const router = require('express').Router();
const { AuthorController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');
// must be a user and login into the website allow for both (user/admin). isAuth, allowedTo('admin', 'user'),
router.get('/', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getAuthors());
  if (!err) {
    res.json(authors);
  }
  return next(err);
});
// isAuth,allowedTo('admin', 'user')

router.get(
  '/pagination',
  async (req, res, next) => {
    const [err, authors] = await asyncWrapper(
      AuthorController.getAuthorsPagination(req.query),
    );
    if (!err) {
      res.json(authors);
    }
    return next(err);
  },
);

// in home page can any one without login see popular authors
router.get('/popular', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(
    AuthorController.getPopularAuthors(),
  );
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

// get specific book by id  // check if query params is equal to id=true  isAuth, allowedTo('user')
router.get('/:id', async (req, res, next) => {
  if (req.query.id === 'true') {
    const [err, authorID] = await asyncWrapper(
      AuthorController.getAuthorIdByNumId(req.params.id),
    );
    if (!authorID) {
      return next(new AppError('Author not found', 404));
    }
    if (!err) {
      return res.json(authorID);
    }
    return next(err);
  }
  console.log(req.params.id);
  const [err, author] = await asyncWrapper(
    AuthorController.getAuthorById(req.params.id),
  );
  if (!author) {
    return next(new AppError('Author not found', 404));
  }

  if (!err) {
    return res.json(author);
  }

  return next(err);
});

// CRUD operation in book allow for adimn only

router.post('/', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('Author not created', 404));
  }
  const responseData = { ...data.toObject(), message: 'Created successfully' };
  res.json(responseData);
});

router.patch('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(
    AuthorController.update(req.params.id, req.body),
  );
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('Author not found', 404));
  }
  const responseData = { ...data.toObject(), message: 'updated successfully' };
  res.json(responseData);
});

router.delete('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(
    AuthorController.deleteAthor(req.params.id),
  );
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('Author not found', 404));
  }
  const responseData = { ...data.toObject(), message: 'deleted successfully' };
  res.json(responseData);
});
module.exports = router;
