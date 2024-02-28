const mongoose = require("mongoose");

const { Schema } = mongoose;

const authorSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 20,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 20,
    minLength: 3,
  },
  description: {
    type: String,
    maxLength: 200,
    minLength: 10,
  },
  dob: { type: Date },
  image: { type: String },
});
authorSchema.pre("save", async function (next) {
  if (this.isNew) {
    const authors = await this.constructor.find().sort({ id: -1 });
    if (authors.length === 0) this.id = 1;
    else this.id = authors[0].id + 1;
  }
  next();
});
authorSchema.pre("findOneAndUpdate", function foau(next) {
  this.options.runValidators = true;
  next();
});
const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
