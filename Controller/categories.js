const AppError = require('../lib/appError');
const Category = require('../models/category');

const addCategory = async (userData) => {
  const { name } = userData;
  const newCategory = await Category.create({ name }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return newCategory;
};

const updateCategory = async (userData, id) => {
  const { name } = userData;
  const updatedCategory = await Category.findByIdAndUpdate({ _id: id }, { name }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const newCategory = await Category.findByIdAndDelete({ _id: id }).catch((err) => {
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
      throw new AppError(err.message, 500);
    });
  return categories;
};

module.exports = {
  addCategory, updateCategory, deleteCategory, getPopularCategories, getAllCategories,
};
