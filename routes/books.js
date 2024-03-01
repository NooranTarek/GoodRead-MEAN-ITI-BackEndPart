/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const { BookController } = require('../Controller');
const { UserController } = require('../Controller');
const { ReviewController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
const AppError = require('../lib/appError');
const { isAuth } = require('../Middleware/authentication');
const allowedTo = require('../Middleware/authorization');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/books');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// must be a user and login into the website allow for both (user/admin).
// isAuth, allowedTo("admin", "user"),
router.get('/', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
  if (!err) {
    return res.json(authors);
  }
  return next(err);
});

// isAuth,allowedTo("admin", "user"),
router.get('/pagination', async (req, res, next) => {
  const [err, authors] = await asyncWrapper(
    BookController.getBooksForPagination(req.query),
  );
  if (!err) {
    return res.json(authors);
  }
  return next(err);
});

// in home page can any one without ligin see popular books
router.get('/popular', async (req, res, next) => {
  const [err, books] = await asyncWrapper(BookController.getPopularBooks());
  if (!err) {
    return res.json(books);
  }
  return next(err);
});

// for user can get books filter by shelve and pagination
// isAuth, allowedTo("user"),
router.get('/shelve',isAuth, allowedTo("user"), async (req, res, next) => {
  const id2 = '65df2c0db4b8dfb11ffb25ab';
  const [err, books] = await asyncWrapper(
    // BookController.getBooksFilterByShelve(req.user._id, req.query)
    BookController.getBooksFilterByShelve(id2, req.query),
  );
  if (!err) {
    return res.json(books);
  }
  return next(err);
});

// get specific book by id isAuth, allowedTo("user")
router.get('/:id',isAuth, allowedTo("user"), async (req, res, next) => {
  const [err, book] = await asyncWrapper(
    BookController.getBookById(req.params.id),
  );
  if (!book) {
    return next(new AppError('Book not found', 404));
  }

  if (!err) {
    return res.json(book);
  }

  return next(err);
});

// CRUD operation in book allow for adimn only

// create review for specifc book maked by specific user isAuth, allowedTo("user")
router.post('/:id/review',isAuth, allowedTo("user"), async (req, res, next) => {
  const id2 = '65df2c76b4b8dfb11ffb25b1';
  const [err, data] = await asyncWrapper(BookController.createReview(id2, req.body, req.params.id));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not created', 422));
  }
  const responseData = {
    ...data.toObject(),
    message: 'Created successfully',
  };
  return res.json(responseData);
});

// ================ With Image ==================\\
router.post('/',isAuth, allowedTo("admin"), upload.single('image'), async (req, res, next) => {
  const image = req.file.originalname;
  const {
    title, category, author, description,
  } = req.body;
  const extractedData = {
    title, category, author, description, image,
  };
  const [err, data] = await asyncWrapper(BookController.create(extractedData));

  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError('not created', 422));
  }
  const responseData = {
    ...data.toObject(),
    message: 'Created successfully',
  };
  return res.json(responseData);
});

router.patch(
  '/:id',
 isAuth,
   allowedTo("admin"),

  async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.update(req.params.id, req.body),
    );

    if (!data) {
      return next(new AppError('Book not found', 404));
    }
    if (err) {
      return next(err);
    }
    if (!data) {
      return next(new AppError('not updated successfully', 422));
    }
    const responseData = {
      ...data.toObject(),
      message: 'Updated successfully',
    };
    return res.json(responseData);
  },
);

router.patch(
  '/:id/rating', // Path without the base URL ?rate=5
  isAuth,
  allowedTo('admin', 'user'),
  // add rating in user also in list of books
  async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.updateRating(req.params.id, req.query.rate),
    );
    // req.user._id userId, bookId, newRating
    // eslint-disable-next-line no-underscore-dangle
    // console.log(USER ID ${req.user._id});
    await UserController.updateRating(
      req.user._id,
      req.params.id,
      req.query.rate,
    );
    if (!data) {
      return next(new AppError('Book not found', 404));
    }
    if (err) {
      return next(err);
    }
    const responseData = {
      ...data.toObject(),
      message: 'Updated successfully',
    };
    return res.json(responseData);
  },
);

// isAuth,allowedTo("admin", "user"),
router.patch(
  '/:id/shelve', // shelve?shelve=(read/ want to read /reading)
  isAuth,allowedTo("admin", "user"),
  // add rating in user also in list of books
  async (req, res, next) => {
    // const [err, data] =
    const id2 = '65df2c0db4b8dfb11ffb25ab';
    await UserController.updateShelve(id2, req.params.id, req.query.shelve);
    /* if (!data) {
      return next(new AppError('Book not found', 404));
    }
    if (err) {
      return next(err);
    }
    const responseData = {
      ...data.toObject(),
      message: 'Updated successfully',
    }; */
    return res.json('updated successfully');
  },
);

router.delete(
  '/:id',
   isAuth, allowedTo("admin"),  async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.deleteBook(req.params.id),
    );
    if (!data) {
      return next(new AppError('Book not found', 404));
    }
    if (err) {
      return next(err);
    }
    if (!data) {
      return next(new AppError('not delete successfully', 422));
    }
    const responseData = { ...data.toObject(), message: 'Delete successfully' };
    return res.json(responseData);
  },
);

// get reviews for book
router.get('/:id/reviews',isAuth,allowedTo("user"), async (req, res, next) => {
  const [err, reviews] = await asyncWrapper(ReviewController.getBookReviews(req.params.id));
  if (err) {
    return next(err);
  }
  if (!reviews && !reviews.length > 0) {
    return next(new AppError('not find', 422));
  }
  const responseData = {
    reviews: reviews.map((review) => review.toObject()),
    message: 'Found successfully',
  };
  return res.json(responseData);
});

module.exports = router;
