const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true },
});
categorySchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
