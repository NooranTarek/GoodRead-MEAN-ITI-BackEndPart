const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  image: { type: String, required: true },
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

categorySchema.pre('save', async function (next) {
  if (this.isNew) {
    const categories = await this.constructor.find().sort({ id: -1 });
    if (categories.length === 0) this.id = 1;
    else this.id = categories[0].id + 1;
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
