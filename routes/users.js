const router = require('express').Router();
const { UserController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');

router.post('/', async (req, res, next) => {
  const [err, data] = await asyncWrapper(UserController.register(req.body));
  if (!err) {
    res.json({ message: 'User created successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.post('/login', async (req, res, next) => {
  const [err, data] = await asyncWrapper(UserController.login(req.body));
  if (!err) {
    res.json({ message: 'User logged in successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});
module.exports = router;
