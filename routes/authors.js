const router = require('express').Router();
const { AuthorController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');

router.get('/author', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getAuthors(req.query));
  res.json(authors);
  if (!err) {
    res.json(authors);
  }
  return next(err);
});

router.post('/author', async (req, res, next) => {
  const [err] = await asyncWrapper(AuthorController.create(req.body));
  if (!err) {
    res.json('created sucessfully');
  }
  return next(err);
});

router.patch('/author/:id', async (req, res, next) => {
  const [err] = await asyncWrapper(AuthorController.update(req.params.id, req.body));
  if (!err) {
    res.json('updated sucessfully');
  }
  return next(err);
});

router.delete('/author/:id', async (req, res, next) => {
  const [err, todo] = await asyncWrapper(AuthorController.deleteAthor(req.params.id));
  if (!err) {
    return res.json(todo);
  }
  return next(err);
});
module.exports = router;
