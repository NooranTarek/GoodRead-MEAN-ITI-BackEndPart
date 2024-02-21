/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },
    firstName: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid first name!`,
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid last name!`,
      },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    image: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Remove password field from JSON
        return ret;
      },
    },
  },
);

usersSchema.pre('save', async function (next) {
  if (this.isNew) {
    const users = await this.constructor.find().sort({ id: -1 });
    if (users.length === 0) this.id = 1;
    else this.id = users[0].id + 1;
  }
  next();
});
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
