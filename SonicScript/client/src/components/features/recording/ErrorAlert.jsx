// ===========================================
// ErrorAlert — Animated Error Notification
// ===========================================
//
// A slide-in error banner that appears when speech recognition
// encounters a problem. Features auto-dismiss after 8 seconds
// and a manual close button.
//
// DESIGN:
//   - Semi-transparent red background
//   - Glass morphism border
//   - Slides in from the top
//   - Cross button to dismiss manually
// ===========================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ErrorAlert — Dismissible error notification with auto-hide.
 *
 * @param {Object} props
 * @param {Object|null} props.error - Error object { code, message }
 * @param {function} props.onDismiss - Called when user dismisses the alert
 */
export default function ErrorAlert({ error, onDismiss }) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          id="error-alert"
          className="w-full max-w-xl mx-auto"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
            {/* Error icon */}
            <span className="text-red-400 text-lg shrink-0 mt-0.5">⚠️</span>

            {/* Error message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-300 leading-relaxed">
                {error.message}
              </p>
              {/* Show error code in a muted style for debugging */}
              <p className="text-xs text-red-400/50 mt-1">
                Code: {error.code}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              id="dismiss-error"
              onClick={onDismiss}
              className="text-red-400/60 hover:text-red-300 transition-colors shrink-0 p-1 cursor-pointer"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
