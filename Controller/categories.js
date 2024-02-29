const AppError = require('../lib/appError');
const Book = require('../models/book');
const Category = require('../models/category');

const addCategory = async (userData) => {
  const { name, image } = userData;
  const newCategory = await Category.create({ name, image }).catch((err) => {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      // Duplicate key error, category name already exists
      throw new AppError(`Category name "${name}" already exists. Please choose a different name`, 400);
    }
    throw new AppError(err.message, 400);
  });
  return newCategory;
};

const updateCategory = async (userData, id) => {
  const { name } = userData;

  const updatedCategory = await Category.findOneAndUpdate({ id }, { name }).catch((err) => {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      // Duplicate key error, category name already exists
      throw new AppError(`Category name "${name}" already exists. Please choose a different name`, 400);
    }

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

const getAllCategories = async () => {
  const categories = await Category.find()
    .select('_id id name')

    .catch((err) => {
      // console.log(err);
      throw new AppError(err.message, 500);
    });
  // console.log(categories, 'from controller');
  return categories;
};

const categoriesName = async () => {
  const categories = await Category.find()
    .select('name image id')
    .catch((err) => {
      throw new AppError(err.message, 500);
    });
  return categories;
};

const paginateResults = (page, pageSize, data, booksCount) => {
  const startIndex = (page - 1) * pageSize;
  // eslint-disable-next-line radix
  const endIndex = Math.min(parseInt(startIndex) + parseInt(pageSize), booksCount);
  const paginatedData = data.slice(startIndex, endIndex);
  return paginatedData;
};
const booksForSpecificCategory = async (categoryId, page, pageSize) => {
  const category = await Category.findById(categoryId).catch((err) => {
    throw new AppError(err.message, 500);
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }


  const categoryBooks = await Book.find({ category: categoryId })
    .populate('author', '-_id firstName lastName')
    .select('title image -_id')
    .catch((err) => {
      throw new AppError(err.message, 500);
    });

  const booksCount = await Book.countDocuments({ category: categoryId });
  const paginatedBooks = paginateResults(page, pageSize, categoryBooks, booksCount);

  return { categoryName: category.name, booksCount, paginatedBooks };
};

const getCategoryByObjId = async (_id) => {
  const category = await Category.findById(_id).catch((err) => {
    throw new AppError(err.message, 500);
  });
  return {
    category,
  };
};

const getCategoryById = async (id) => {
  const category = await Category.findOne(id).catch((err) => {
    throw new AppError(err.message, 500);
  });
  return {
    category,
  };
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories,
  getAllCategories,
  categoriesName,
  booksForSpecificCategory,
  getCategoryByObjId,
  getCategoryById,
};
