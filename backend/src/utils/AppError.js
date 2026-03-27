/**
 * Custom AppError class for operational errors
 * Operational errors are errors that we can predict and handle gracefully
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture stack trace, excluding this constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}
