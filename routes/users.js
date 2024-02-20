const router = require('express').Router();
const { UserController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
// router.post('/register',UserController.register);
router.post('/register', async (req, res, next) => {
  const [err, data] = await asyncWrapper(UserController.register(req.body));
  console.log(err);
  if (!err) {
    res.json({ message: 'User created successfully', data });
    return;
  }
  // eslint-disable-next-line consistent-return
  return next(new AppError(err.message, 400));
});

module.exports = router;
