const AppError = require('../lib/appError');

const allowedTo = (...roles) => (async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403).json(`you are not authorized you are ==> ${req.user.role}`); // throw new AppError(`you are not authorized you are ==> ${req.user.role}`, 403);
  } else {
    next();
  }
});

module.exports = allowedTo;
