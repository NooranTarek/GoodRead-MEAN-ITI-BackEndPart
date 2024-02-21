const router = require("express").Router();
const { BookController } = require("../Controller");
const asyncWrapper = require("../lib/asyncWrapper");
const AppError = require("../lib/appError");
const { isAuth } = require("../Middleware/authentication");
const allowedTo = require("../Middleware/authorization");

// must be a user and login into the website allow for both (user/admin).
router.get("/", isAuth, allowedTo("admin", "user"), async (req, res, next) => {
  const [err, authors] = await asyncWrapper(BookController.getBooks(req.query));
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

// for user can get books filter by shelve
router.get("/shelve", isAuth, allowedTo("user"), async (req, res, next) => {
  const [err, books] = await asyncWrapper(
    BookController.getBooksFilterByShelve(req.query)
  );
  if (!err) {
    return res.json(books);
  }
  return next(err);
});

// get specific book by id
router.get("/:id", isAuth, allowedTo("user"), async (req, res, next) => {
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

router.post("/", isAuth, allowedTo("admin"), async (req, res, next) => {
  const [err, data] = await asyncWrapper(BookController.create(req.body));
  if (err) {
    return next(err);
  }
  if (!data) {
    return next(new AppError("not created", 422));
  }
  const responseData = { ...data.toObject(), message: "Created successfully" };
  return res.json(responseData);
});

router.patch(
  "/:id",
  isAuth,
  allowedTo("admin", "user"),
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

router.delete("/:id", isAuth, allowedTo("admin"), async (req, res, next) => {
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
});
module.exports = router;
