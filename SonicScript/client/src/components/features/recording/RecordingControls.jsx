// ===========================================
// RecordingControls — Start / Stop / Pause Buttons
// ===========================================
//
// A row of contextual control buttons that change based on
// the current recording state. Uses Framer Motion for smooth
// button entrance/exit animations.
//
// BUTTON VISIBILITY LOGIC:
//   idle    → [Start Recording]
//   listening → [Pause] [Stop]
//   paused  → [Resume] [Stop]
//   stopped → [New Recording]
// ===========================================

import { motion, AnimatePresence } from 'framer-motion';

/**
 * RecordingControls — Contextual recording action buttons.
 *
 * @param {Object} props
 * @param {string} props.status - Current recording status
 * @param {function} props.onStart - Start recording
 * @param {function} props.onStop - Stop recording
 * @param {function} props.onPause - Pause recording
 * @param {function} props.onResume - Resume recording
 * @param {function} props.onReset - Clear and reset
 */
export default function RecordingControls({
  status,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}) {
  // Animation variants for button entrance/exit
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -10 },
  };

  return (
    <div id="recording-controls" className="flex items-center justify-center gap-3 flex-wrap">
      <AnimatePresence mode="wait">
        {/* IDLE STATE — Show "Start Recording" button */}
        {status === 'idle' && (
          <motion.button
            key="start"
            id="btn-start"
            onClick={onStart}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-sonic-accent-glow cursor-pointer"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            🎤 Start Recording
          </motion.button>
        )}

        {/* LISTENING STATE — Show Pause and Stop */}
        {status === 'listening' && (
          <motion.div
            key="listening-controls"
            className="flex items-center gap-3"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <motion.button
              id="btn-pause"
              onClick={onPause}
              className="px-5 py-2.5 text-sm font-medium text-yellow-300 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/10 transition-all duration-200 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              ⏸ Pause
            </motion.button>

            <motion.button
              id="btn-stop"
              onClick={onStop}
              className="px-5 py-2.5 text-sm font-medium text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              ⏹ Stop
            </motion.button>
          </motion.div>
        )}

        {/* PAUSED STATE — Show Resume and Stop */}
        {status === 'paused' && (
          <motion.div
            key="paused-controls"
            className="flex items-center gap-3"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <motion.button
              id="btn-resume"
              onClick={onResume}
              className="px-5 py-2.5 text-sm font-medium text-sonic-success border border-sonic-success/30 rounded-xl hover:bg-sonic-success/10 transition-all duration-200 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              ▶ Resume
            </motion.button>

            <motion.button
              id="btn-stop-paused"
              onClick={onStop}
              className="px-5 py-2.5 text-sm font-medium text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              ⏹ Stop
            </motion.button>
          </motion.div>
        )}

        {/* STOPPED STATE — Show New Recording */}
        {(status === 'stopped' || status === 'error') && (
          <motion.button
            key="new-recording"
            id="btn-new-recording"
            onClick={onReset}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-sonic-accent-glow cursor-pointer"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            🎤 New Recording
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
