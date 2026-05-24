// ===========================================
// Custom Error Class — AppError
// ===========================================
//
// WHY DO WE NEED THIS?
// --------------------
// By default, JavaScript's Error class only has a "message" property.
// But in a REST API, we also need an HTTP status code (400, 404, 500, etc.)
// to tell the client WHAT kind of error happened.
//
// This class extends Error to include a "statusCode" property.
//
// USAGE:
//   throw new AppError('File not found', 404);
//   throw new AppError('Invalid file type', 400);
//
// The error handler middleware (errorHandler.js) will catch these
// and send back a clean JSON response like:
//   { "status": "error", "message": "File not found" }
// ===========================================

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {number} statusCode - HTTP status code (400, 404, 500, etc.)
   */
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;

    // "fail" for 4xx client errors, "error" for 5xx server errors
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    // This flag helps us distinguish intentional errors from unexpected crashes
    this.isOperational = true;

    // Captures where the error was thrown (helpful for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
