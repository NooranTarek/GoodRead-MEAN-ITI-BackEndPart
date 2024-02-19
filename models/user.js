/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      /*validate: {
        validator(value) {
          return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },*/
  },
    lastName: {
      type: String,
      required: true,
      /*validate: {
        validator(value) {
          return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },*/
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    image: { type: String },
  },
  {
    timestamps: true,
    /*toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Remove password field from JSON
        return ret;
      },
    },*/
  },
);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
