const router = require('express').Router();
const { AuthorController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');

router.get('/', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getAuthors(req.query));
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

router.post('/', async (req, res, next) => {
  const [err] = await asyncWrapper(AuthorController.create(req.body));
  if (!err) {
    res.json('created sucessfully');
  }
  return next(err);
});

router.patch('/:id', async (req, res, next) => {
  const [err] = await asyncWrapper(AuthorController.update(req.params.id, req.body));
  if (!err) {
    res.json('updated sucessfully');
  }
  return next(err);
});

router.delete('/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(AuthorController.deleteAthor(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});
module.exports = router;
