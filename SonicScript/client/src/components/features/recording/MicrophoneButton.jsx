// ===========================================
// MicrophoneButton — Animated Recording Button
// ===========================================
//
// This is the centerpiece of the recording page — a large circular
// button with a pulsing neon glow that activates when listening.
//
// VISUAL STATES:
//   Idle     → Subtle gradient border, static icon
//   Listening → Pulsing concentric glow rings, icon color changes
//   Paused   → Dim glow, pause icon
//   Error    → Red tint
//
// FRAMER MOTION:
//   - whileTap: scales down slightly for tactile feedback
//   - animate: controls the pulsing glow ring animation
//   - AnimatePresence: smoothly transitions between icon states
// ===========================================

import { motion, AnimatePresence } from 'framer-motion';

/**
 * MicrophoneButton — The main recording trigger button.
 *
 * @param {Object} props
 * @param {boolean} props.isListening - Whether speech recognition is active
 * @param {boolean} props.isPaused - Whether recording is paused
 * @param {string} props.status - Current status: 'idle' | 'listening' | 'paused' | 'stopped' | 'error'
 * @param {function} props.onClick - Click handler to toggle recording
 */
export default function MicrophoneButton({ isListening, isPaused, status, onClick }) {
  // Determine which icon to show based on current state
  const getIcon = () => {
    if (isPaused) {
      // Pause icon — two vertical bars
      return (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      );
    }

    if (isListening) {
      // Active microphone icon — filled style to show it's recording
      return (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      );
    }

    // Default microphone icon — outline style
    return (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  };

  return (
    <div className="relative flex items-center justify-center" id="mic-button-container">
      {/* Pulsing Glow Rings — only show when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            {/* Ring 1 — innermost */}
            <motion.div
              className="absolute rounded-full border-2 border-sonic-accent/30"
              initial={{ width: 130, height: 130, opacity: 0.6 }}
              animate={{
                width: [130, 180],
                height: [130, 180],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            {/* Ring 2 — middle */}
            <motion.div
              className="absolute rounded-full border-2 border-sonic-cyan/25"
              initial={{ width: 130, height: 130, opacity: 0.4 }}
              animate={{
                width: [130, 210],
                height: [130, 210],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
            {/* Ring 3 — outermost */}
            <motion.div
              className="absolute rounded-full border border-sonic-accent/15"
              initial={{ width: 130, height: 130, opacity: 0.3 }}
              animate={{
                width: [130, 240],
                height: [130, 240],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* The Button Itself */}
      <motion.button
        id="mic-button"
        onClick={onClick}
        className={`
          relative z-10 w-[120px] h-[120px] rounded-full
          flex items-center justify-center cursor-pointer
          transition-colors duration-300 border-2
          ${isListening
            ? 'bg-sonic-accent/20 border-sonic-accent text-sonic-accent shadow-[0_0_40px_rgba(139,92,246,0.4)]'
            : isPaused
              ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
              : status === 'error'
                ? 'bg-red-500/10 border-red-500/50 text-red-400'
                : 'bg-white/5 border-sonic-border text-sonic-text-dim hover:border-sonic-accent/50 hover:text-sonic-accent hover:bg-sonic-accent/5 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]'
          }
        `}
        // Framer Motion interaction animations
        whileTap={{ scale: 0.93 }}
        whileHover={!isListening ? { scale: 1.05 } : {}}
        // Continuous subtle pulse when listening
        animate={
          isListening
            ? {
                scale: [1, 1.04, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : { scale: 1 }
        }
        aria-label={isListening ? 'Stop recording' : isPaused ? 'Resume recording' : 'Start recording'}
      >
        {/* Icon with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
