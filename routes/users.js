const router = require('express').Router();
const multer = require('multer');
const { UserController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/users');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res, next) => {
  const imageOriginalName = req.file.originalname;
  req.body.image = imageOriginalName;
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
