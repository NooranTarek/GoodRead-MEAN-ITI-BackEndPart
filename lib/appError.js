class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 500; // Set default status code to 500 if not provided
  }
}

module.exports = AppError;
