const jwt = require('jsonwebtoken');
const AppError = require('../lib/appError');

const isAuth = (req, res, next) => {
  try {
    const token = req.header('token');
    const verified = jwt.verify(token, process.env.JWT_KEY); // if true return payload
    if (verified) {
      req.user = verified.userExist;
      return next();
    }
  } catch (error) {
    throw new AppError('Your are not authenticated please login', 403);
  }
};

module.exports = {
  isAuth,
};
