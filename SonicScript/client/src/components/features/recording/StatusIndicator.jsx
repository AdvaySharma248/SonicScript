// ===========================================
// StatusIndicator — AI Listening Status Display
// ===========================================
//
// Shows the current state of the speech recognition engine
// with an animated dot and descriptive text. Uses AnimatePresence
// for smooth transitions between states.
//
// STATES:
//   idle      → White dot, "Ready to listen"
//   listening → Green pulsing dot, "AI is listening..."
//   paused    → Yellow dot, "Paused"
//   stopped   → Blue dot, "Recording complete"
//   error     → Red dot, "Error occurred"
// ===========================================

import { motion, AnimatePresence } from 'framer-motion';

/**
 * StatusIndicator — Visual AI status with animated transitions.
 *
 * @param {Object} props
 * @param {string} props.status - Current status
 */
export default function StatusIndicator({ status }) {
  // Map each status to its visual properties
  const statusConfig = {
    idle: {
      color: 'bg-sonic-text-dim',
      text: 'Ready to listen',
      pulse: false,
    },
    listening: {
      color: 'bg-sonic-success',
      text: 'AI is listening...',
      pulse: true,
    },
    paused: {
      color: 'bg-yellow-400',
      text: 'Paused',
      pulse: false,
    },
    stopped: {
      color: 'bg-sonic-cyan',
      text: 'Recording complete',
      pulse: false,
    },
    error: {
      color: 'bg-red-400',
      text: 'Error occurred',
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div id="status-indicator" className="flex items-center justify-center gap-3">
      {/* Animated Dot */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring (only when listening) */}
        {config.pulse && (
          <motion.div
            className={`absolute w-4 h-4 rounded-full ${config.color}`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Inner dot */}
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${config.color}`}
          layout // Smooth position transitions
          animate={
            config.pulse
              ? {
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : { scale: 1 }
          }
        />
      </div>

      {/* Status Text with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.span
          key={status} // Re-animates when status changes
          className="text-sm font-medium text-sonic-text-dim tracking-wide"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {config.text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
