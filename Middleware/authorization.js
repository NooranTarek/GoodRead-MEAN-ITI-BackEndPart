const AppError = require('../lib/appError');

const allowedTo = (...roles) => (async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError(`you are not authorized you are ==> ${req.user.role}`, 403);
  } else {
    next();
  }
});

module.export = {allowedTo}