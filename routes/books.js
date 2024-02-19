const router = require('express').Router();
const { BookController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');

router.get('/', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
  res.json(authors);
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

router.post('/', async (req, res, next) => {
  const [err] = await asyncWrapper(BookController.create(req.body));
  if (!err) {
    res.json('created sucessfully');
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  const [err] = await asyncWrapper(BookController.update(req.params.id, req.body));
  if (!err) {
    res.json('updated sucessfully');
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(BookController.deleteBook(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});
module.exports = router;
