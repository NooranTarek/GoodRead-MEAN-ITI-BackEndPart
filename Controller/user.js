const JWT = require('jsonwebtoken');
const AppError = require('../lib/appError');
const { hashFunction, compareFunction } = require('../lib/hashAndCompare');
const Users = require('../models/user');

// module.exports = { register };
const register = async (userData) => {
  const {
    firstName, lastName, email, password, repassword, username,
  } = userData;
  if (password !== repassword) {
    throw new AppError("Passwords don't match .. try to fill them again", 400);
  } else {
    const hashedPassword = await hashFunction({ plainText: password });
    const newUser = await Users.create({
      firstName, lastName, email, password: hashedPassword, username,
    }).catch((err) => {
      throw new AppError(err.message, 400);
    });
    return newUser;
  }
};

// login user
const login = async (userData) => {
  const { username, password } = userData;
  const userExist = await Users.findOne({ username });
  if (!userExist) {
    throw new AppError('sorry there is no user with this username', 400);
  } else {
    const match = await compareFunction({ plainText: password, hash: userExist.password });
    if (!match) {
      throw new AppError("Passwords don't match .. try to fill them again", 400);
    } else {
      const token = JWT.sign({ userExist }, process.env.JWT_KEY);
      return token;
    }
  }
};
module.exports = { register, login };