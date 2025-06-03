const CustomError = require('./CustomError');

class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
