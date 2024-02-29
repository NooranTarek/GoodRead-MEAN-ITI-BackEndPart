/* eslint-disable no-underscore-dangle */
const router = require("express").Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const { BookController } = require("../Controller");
const { UserController } = require("../Controller");
const asyncWrapper = require("../lib/asyncWrapper");
const AppError = require("../lib/appError");
const { isAuth } = require("../Middleware/authentication");
const allowedTo = require("../Middleware/authorization");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/images");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// must be a user and login into the website allow for both (user/admin).
// isAuth, allowedTo("admin", "user"),
router.get("/", async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
  if (!err) {
    return res.json(authors);
  }
  return next(err);
});

// isAuth,allowedTo("admin", "user"),
router.get("/pagination", async (req, res, next) => {
  const [err, authors] = await asyncWrapper(
    BookController.getBooksForPagination(req.query)
  );
  if (!err) {
    return res.json(authors);
  }
  return next(err);
});

// in home page can any one without ligin see popular books
router.get("/popular", async (req, res, next) => {
  const [err, books] = await asyncWrapper(BookController.getPopularBooks());
  if (!err) {
    return res.json(books);
  }
  return next(err);
});

// for user can get books filter by shelve and pagination
// isAuth, allowedTo("user"),
router.get("/shelve", async (req, res, next) => {
  console.log("here");
  const id2 = "65df2c0db4b8dfb11ffb25ab";
  const [err, books] = await asyncWrapper(
    // BookController.getBooksFilterByShelve(req.user._id, req.query)
    BookController.getBooksFilterByShelve(id2, req.query)
  );
  if (!err) {
    return res.json(books);
  }
  return next(err);
});

// get specific book by id isAuth, allowedTo("user")
router.get("/:id", async (req, res, next) => {
  const [err, book] = await asyncWrapper(
    BookController.getBookById(req.params.id)
  );
  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  if (!err) {
    return res.json(book);
  }

  return next(err);
});

// CRUD operation in book allow for adimn only
//  isAuth,allowedTo("admin")
router.post("/", async (req, res, next) => {
  // req.body.image = 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  const [err, data] = await asyncWrapper(BookController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError("not created", 422));
  }
  const responseData = {
    ...data.toObject(),
    message: "Created successfully",
  };
  return res.json(responseData);
});
// ================ With Image ==================\\
// router.post("/", upload.single("image"), async (req, res, next) => {
//   const imageOriginalName = req.file.originalname;
//   req.body.image = imageOriginalName;
//   const [err, data] = await asyncWrapper(BookController.create(req.body));

//   if (err) {
//     return next(err);
//   }
//   if (!data) {
//     return next(new AppError("not created", 422));
//   }
//   const responseData = {
//     ...data.toObject(),
//     message: "Created successfully",
//   };
//   return res.json(responseData);
// });

router.patch(
  "/:id",
  /// / isAuth,
  // allowedTo("admin", "user"),

  async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.update(req.params.id, req.body)
    );
    if (!data) {
      return next(new AppError("Book not found", 404));
    }
    if (err) {
      return next(err);
    }
    if (!data) {
      return next(new AppError("not updated successfully", 422));
    }
    const responseData = {
      ...data.toObject(),
      message: "Updated successfully",
    };
    return res.json(responseData);
  }
);
router.patch(
  "/:id/rating", // Path without the base URL ?rate=5
  isAuth,
  allowedTo("admin", "user"),
  // add rating in user also in list of books
  async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.updateRating(req.params.id, req.query.rate)
    );
    // req.user._id userId, bookId, newRating
    // eslint-disable-next-line no-underscore-dangle
    // console.log(USER ID ${req.user._id});
    await UserController.updateRating(
      req.user._id,
      req.params.id,
      req.query.rate
    );
    if (!data) {
      return next(new AppError("Book not found", 404));
    }
    if (err) {
      return next(err);
    }
    const responseData = {
      ...data.toObject(),
      message: "Updated successfully",
    };
    return res.json(responseData);
  }
);
// isAuth,allowedTo("admin", "user"),
router.patch(
  "/:id/shelve", // shelve?shelve=(read/ want to read /reading)

  // add rating in user also in list of books
  async (req, res, next) => {
    // const [err, data] =
    const id2 = "65df2c0db4b8dfb11ffb25ab";
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
    return res.json("updated successfully");
  }
);
router.delete(
  "/:id",
  /* isAuth, allowedTo("admin"), */ async (req, res, next) => {
    const [err, data] = await asyncWrapper(
      BookController.deleteBook(req.params.id)
    );
    if (!data) {
      return next(new AppError("Book not found", 404));
    }
    if (err) {
      return next(err);
    }
    if (!data) {
      return next(new AppError("not delete successfully", 422));
    }
    const responseData = { ...data.toObject(), message: "Delete successfully" };
    return res.json(responseData);
  }
);

module.exports = router;
