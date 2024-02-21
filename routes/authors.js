const router = require('express').Router();
const { AuthorController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');
// must be a user and login into the website allow for both (user/admin).
router.get('/', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getAuthors(req.query));
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

// in home page can any one without login see popular authors
router.get('/popular', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getPopularAuthors());
  if (!err) {
    res.json(authors);
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
    return next(new Error('not Created'));
  }
  const responseData = { ...data.toObject(), message: 'Created successfully' };
  res.json(responseData);
});

router.patch('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.update(req.params.id, req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new Error('not updated'));
  }
  const responseData = { ...data.toObject(), message: 'updated successfully' };
  res.json(responseData);
});

router.delete('/:id', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.deleteAthor(req.params.id));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new Error('not deleted'));
  }
  const responseData = { ...data.toObject(), message: 'deleted successfully' };
  res.json(responseData);
});
module.exports = router;
