const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
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

const Category = mongoose.model('Category', categorySchema);
categorySchema.pre('save', async function (next) {
  if (this.isNew) {
    const maxId = await Category.find().sort({ id: -1 }).limit(1);
    this.maxId = maxId[0].id + 1;
  }
  next();
});

module.exports = Category;
