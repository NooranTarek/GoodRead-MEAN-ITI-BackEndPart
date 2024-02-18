const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dob: { type: Date },
  cover: { type: String, required: true },
});
authorSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
