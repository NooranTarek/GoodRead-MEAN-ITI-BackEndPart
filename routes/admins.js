const router = require('express').Router();
const { AdminController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');

router.post('/addAdmin', isAuth, allowedTo('admin'), async (req, res, next) => {
  const [err, data] = await asyncWrapper(AdminController.addAdmin(req.body));
  if (!err) {
    res.json({ message: 'User created successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

router.post('/login', async (req, res, next) => {
  const [err, data] = await asyncWrapper(AdminController.login(req.body));
  if (!err) {
    res.json({ message: 'User logged in successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

module.exports = router;
