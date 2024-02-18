/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema(
  {
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
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
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
usersSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    await docToUpdate.validate();

    next();
  } catch (error) {
    next(error);
  }
});
usersSchema.pre('save', async function preSave() {
  this.password = await bcrypt.hash(this.password, 10);
});
usersSchema.methods.verifyPassword = async function verifyPassword(password) {
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
