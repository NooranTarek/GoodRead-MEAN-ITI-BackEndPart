const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  firstName: {
    type: String, required: true, maxLength: 20, minLength: 3,
  },
  lastName: {
    type: String, required: true, maxLength: 20, minLength: 3,
  },
  description: {
    type: String, required: true, maxLength: 200, minLength: 10,
  },
  dob: { type: Date },
  image: { type: String, required: true },
});
authorSchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
});
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
