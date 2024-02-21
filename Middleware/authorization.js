const AppError = require('../lib/appError');

const allowedTo = (...roles) => (req, res, next) => {
  // console.log(req.user.role);
  if (!roles.includes(req.user.role)) {
    throw new AppError(`you are not authorized you are ==> ${req.user.role}`, 403);
  } else {
    next();
  }
};

module.exports = allowedTo;
