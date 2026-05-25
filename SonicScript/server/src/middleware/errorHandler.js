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
// 4. Mongoose validation fails → catchAsync forwards the error here
//
// WHAT'S NEW IN DAY 3?
// --------------------
// ✅ Added Mongoose ValidationError handling
// ✅ Added Mongoose CastError handling (invalid ObjectId)
// ✅ Added MongoDB duplicate key error handling
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting the 4th parameter (next) → Express won't recognize it
// 2. Putting the error handler BEFORE routes → it won't catch route errors
// 3. Not calling next(error) in async code → errors get swallowed silently
// ===========================================

import multer from 'multer';

// -------------------------------------------
// Helper: Handle Mongoose Validation Errors
// -------------------------------------------
// When schema validation fails (e.g., missing required field,
// invalid enum value), Mongoose throws a ValidationError with
// details about EVERY field that failed.
//
// We extract those details and create a user-friendly message.
//
// Example input error:
//   "Transcription validation failed: transcript: Transcript text is required"
// Example output message:
//   "Invalid input: Transcript text is required"
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${errors.join('. ')}`;
  return { statusCode: 400, message };
};

// -------------------------------------------
// Helper: Handle Mongoose CastError
// -------------------------------------------
// This happens when someone sends an invalid MongoDB ObjectId.
// Example: GET /api/transcriptions/not-a-valid-id
//
// MongoDB ObjectIds are 24-character hex strings like:
//   "665abc123def456789abcdef"
// Anything else causes a CastError.
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: "${err.value}". Expected a valid MongoDB ObjectId.`;
  return { statusCode: 400, message };
};

// -------------------------------------------
// Helper: Handle MongoDB Duplicate Key Error
// -------------------------------------------
// This happens when you try to insert a document that violates
// a unique index. For example, if email must be unique and
// someone tries to register with an existing email.
//
// Error code 11000 = duplicate key error
const handleDuplicateKeyError = (err) => {
  // Extract the field name and value from the error
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value: "${value}" already exists for field "${field}". Please use a different value.`;
  return { statusCode: 400, message };
};

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
  // Handle Mongoose Validation Errors
  // -------------------------------------------
  // These occur when data doesn't match the schema rules
  // (e.g., missing required field, value outside enum, etc.)
  if (err.name === 'ValidationError') {
    const { statusCode, message } = handleValidationError(err);
    return res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }

  // -------------------------------------------
  // Handle Mongoose CastError (Invalid ObjectId)
  // -------------------------------------------
  // Occurs when an invalid ID format is passed to findById()
  if (err.name === 'CastError') {
    const { statusCode, message } = handleCastError(err);
    return res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }

  // -------------------------------------------
  // Handle MongoDB Duplicate Key Error
  // -------------------------------------------
  // Error code 11000 = unique constraint violation
  if (err.code === 11000) {
    const { statusCode, message } = handleDuplicateKeyError(err);
    return res.status(statusCode).json({
      status: 'fail',
      message,
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
