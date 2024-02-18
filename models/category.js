const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String, required: true, maxLength: 20, minLength: 3,
  },
});
categorySchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
