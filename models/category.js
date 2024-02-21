const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20,
    minLength: 3,
    validate: {
      validator(value) {
        return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
    unique: true,
  },
});
/* categorySchema.pre('findOneAndUpdate', function foau(next) {
  this.options.runValidators = true;
  next();
}); */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
