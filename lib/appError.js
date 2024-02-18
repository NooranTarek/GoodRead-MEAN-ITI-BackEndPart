class appError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
module.exports = appError;
