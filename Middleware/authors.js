const { AuthorController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');

const getAuthors = async (req, res, next) => {
  const [err, authors] = await asyncWrapper(AuthorController.getAuthors(req.query));
  if (!err) {
    res.json(authors);
  }
  return next(err);
};

const createAuthor = async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new Error('not Created successfully'));
  }
  const responseData = { ...data.toObject(), message: 'Created successfully' };
  res.json(responseData);
};

const updateAuthor = async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.update(req.params.id, req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new Error('not updated successfully'));
  }
  const responseData = { ...data.toObject(), message: 'updated successfully' };
  res.json(responseData);
};

const deleteAuthor = async (req, res, next) => {
  const [err, data] = await asyncWrapper(AuthorController.deleteAthor(req.params.id));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new Error('not deleted successfully'));
  }
  const responseData = { ...data.toObject(), message: 'deleted successfully' };
  res.json(responseData);
};
module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
