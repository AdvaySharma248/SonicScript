// ===========================================
// Centralized Error Handling Middleware
// ===========================================
//
// WHAT DOES THIS DO?
// ------------------
// This is the "safety net" for your entire API. Any error that happens
// anywhere in your code — whether you throw it intentionally or it's
// an unexpected crash — gets caught here and turned into a clean
// JSON response for the client.
//
// HOW DOES EXPRESS KNOW THIS IS AN ERROR HANDLER?
// ------------------------------------------------
// Express identifies error handlers by their FOUR parameters:
//   (err, req, res, next)
// Regular middleware has three: (req, res, next)
// That extra "err" parameter is what tells Express this is special.
//
// HOW ERRORS REACH HERE:
// ----------------------
// 1. You call next(error) in a route → Express skips to this handler
// 2. You throw new AppError('message', 400) → caught and forwarded here
// 3. Multer rejects a file → Multer calls next(error) automatically
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting the 4th parameter (next) → Express won't recognize it
// 2. Putting the error handler BEFORE routes → it won't catch route errors
// 3. Not calling next(error) in async code → errors get swallowed silently
// ===========================================

import multer from 'multer';

/**
 * Centralized error handler — catches ALL errors from routes/middleware
 * and returns a clean, consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (you'll see this in your terminal)
  console.error('❌ Error:', err.message);

  // In development, also log the full stack trace
  if (process.env.NODE_ENV !== 'production') {
    console.error('   Stack:', err.stack);
  }

  // -------------------------------------------
  // Handle Multer-specific errors
  // -------------------------------------------
  // Multer creates its own error types. We convert them to
  // user-friendly messages instead of cryptic internal ones.

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          status: 'fail',
          message: '📁 File is too large! Maximum allowed size is 25 MB.',
        });

      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          status: 'fail',
          message: '📁 Too many files! Please upload only one file at a time.',
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          status: 'fail',
          message: '📁 Unexpected field name. Use "audio" as the field name in your form.',
        });

      default:
        return res.status(400).json({
          status: 'fail',
          message: `📁 Upload error: ${err.message}`,
        });
    }
  }

  // -------------------------------------------
  // Handle our custom file type validation error
  // -------------------------------------------
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // -------------------------------------------
  // Handle our custom AppError instances
  // -------------------------------------------
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // -------------------------------------------
  // Handle unexpected/unknown errors
  // -------------------------------------------
  // For security, don't leak internal error details in production
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again later.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

export default errorHandler;
