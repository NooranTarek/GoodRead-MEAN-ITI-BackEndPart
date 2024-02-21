const jwt = require('jsonwebtoken');
const AppError = require('../lib/appError');

const secretKey = process.env.JWT_KEY;

const authenticatedUser = (req, res, next) => {
  try {
    const token = req.get('authorization');
    const verified = jwt.verify(token, secretKey); // if true return payload
    if (verified) {
      req.user = verified.id;
      return next();
    }
    throw new AppError('UNAUTHENTICATED', 403);
  } catch (error) {
    throw new AppError('UNAUTHENTICATED', 403);
  }
};
module.exports = {
  authenticatedUser,
};
