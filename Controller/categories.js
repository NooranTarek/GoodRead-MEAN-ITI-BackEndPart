const AppError = require('../lib/appError');
const Book = require('../models/book');
const Category = require('../models/category');

const addCategory = async (userData) => {
  const { name, image } = userData;
  const newCategory = await Category.create({ name, image }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return newCategory;
};

const updateCategory = async (userData, id) => {
  const { name } = userData;
  const updatedCategory = await Category.findOneAndUpdate({ id }, { name }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const newCategory = await Category.findOneAndDelete({ id }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return newCategory;
};
const getPopularCategories = async () => {
  const popularCategories = await Category.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: 'category',
        as: 'booksInCategory',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        bookCount: { $size: '$booksInCategory' },
      },
    },
    { $sort: { bookCount: -1 } },
    { $limit: 10 },
  ]).catch((err) => {
    throw new AppError(err.message, 500);
  });
  return popularCategories;
};

const getAllCategories = async (pageNum, pageSize) => {
  const categories = await Category.find()
    .limit(pageSize)
    .skip((pageNum - 1) * pageSize)
    .exec()
    .catch((err) => {
      // console.log(err);
      throw new AppError(err.message, 500);
    });
  // console.log(categories, 'from controller');
  return categories;
};

const categoriesName = async () => {
  const categories = await Category.find().select('-_id name image id').catch((err) => {
    throw new AppError(err.message, 500);
  });
  return categories;
};

const booksForSpecificCategory = async (categoryId) => {
  const category = await Category.findById({ _id: categoryId }).select('-_id name');
  const categoryBooks = await Book.find({ category: categoryId })
    .populate('author', '-_id firstName lastName')
    .select('title image -_id').catch((err) => {
      throw new AppError(err.message, 500);
    });
  return {
    category,
    books: categoryBooks,
  };
};

// GetAllCategoriesByName ==> get
// GetAllForEachCateogry(Book Nme , Author name)
// getSpecificAuthorById
module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories,
  getAllCategories,
  categoriesName,
  booksForSpecificCategory,
};
