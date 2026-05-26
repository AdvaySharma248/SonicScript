// ===========================================
// Time Formatting Utilities
// ===========================================
//
// These helper functions format raw numbers into human-readable
// strings. We keep them in a separate utils file so they can be
// used anywhere in the app without duplicating logic.
// ===========================================

/**
 * Convert seconds into MM:SS format for the recording timer.
 *
 * Examples:
 *   formatTime(0)   → "00:00"
 *   formatTime(65)  → "01:05"
 *   formatTime(3600) → "60:00"
 *
 * @param {number} totalSeconds - Total elapsed seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (totalSeconds) => {
  // Math.floor() rounds DOWN to the nearest whole number
  // We need this because seconds might be a float
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // .padStart(2, '0') ensures single digits get a leading zero
  // 5 → "05", 12 → "12"
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Format a date string into a human-friendly format.
 *
 * Examples:
 *   formatDate('2026-05-26T12:30:00Z') → "May 26, 2026 at 12:30 PM"
 *
 * @param {string} dateString - ISO date string from MongoDB
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
