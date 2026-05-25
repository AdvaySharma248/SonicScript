// ===========================================
// catchAsync — Async Error Handling Wrapper
// ===========================================
//
// THE PROBLEM:
// ------------
// In Express, if an async function throws an error, Express
// doesn't automatically catch it. The error gets "swallowed"
// and the client hangs forever waiting for a response.
//
// Without this:
//   export const getAll = async (req, res, next) => {
//     try {
//       const data = await Transcription.find();
//       res.json(data);
//     } catch (error) {
//       next(error);  // ← You'd need this in EVERY controller!
//     }
//   };
//
// With this:
//   export const getAll = catchAsync(async (req, res, next) => {
//     const data = await Transcription.find();
//     res.json(data);
//   });
//   // No try/catch needed! catchAsync handles it automatically.
//
// HOW IT WORKS:
// -------------
// catchAsync is a higher-order function (a function that returns a function).
// It wraps your async controller and adds .catch(next) to it.
// If the promise rejects (error), .catch(next) sends the error
// to Express's centralized error handler.
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting to use catchAsync → errors crash the server
// 2. Using try/catch AND catchAsync → redundant (pick one)
// 3. Forgetting 'next' parameter → error handler never receives the error
// ===========================================

/**
 * Wraps an async Express route handler to automatically catch errors.
 *
 * @param {Function} fn - An async function (req, res, next) => { ... }
 * @returns {Function} - A wrapped function that catches rejected promises
 *
 * @example
 * // Instead of try/catch in every controller:
 * export const getAll = catchAsync(async (req, res, next) => {
 *   const data = await Model.find();
 *   res.json(data);
 * });
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next) returns a Promise (because fn is async)
    // .catch(next) catches any rejected promise and passes the error to next()
    // next(error) → Express sends it to the error handling middleware
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
