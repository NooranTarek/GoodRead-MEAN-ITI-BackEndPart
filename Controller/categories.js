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

module.exports = {
  addCategory, updateCategory, deleteCategory,
};
