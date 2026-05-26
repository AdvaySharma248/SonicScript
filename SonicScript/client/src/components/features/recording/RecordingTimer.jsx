// ===========================================
// RecordingTimer — MM:SS Elapsed Time Display
// ===========================================
//
// A simple but polished timer that shows how long the user
// has been recording. Uses monospaced styling for that
// professional "studio timer" look.
// ===========================================

import { motion } from 'framer-motion';
import { formatTime } from '../../../utils/formatTime';

/**
 * RecordingTimer — Displays recording duration in MM:SS format.
 *
 * @param {Object} props
 * @param {number} props.elapsedTime - Elapsed time in seconds
 * @param {boolean} props.isListening - Whether currently recording
 */
export default function RecordingTimer({ elapsedTime, isListening }) {
  return (
    <motion.div
      id="recording-timer"
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-3xl font-light tracking-[0.15em] text-sonic-text-dim"
        style={{ fontVariantNumeric: 'tabular-nums' }} // Monospaced numbers
        // Gentle pulse while recording
        animate={
          isListening
            ? {
                opacity: [0.6, 1, 0.6],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : { opacity: 0.6 }
        }
      >
        {formatTime(elapsedTime)}
      </motion.span>
    </motion.div>
  );
}
