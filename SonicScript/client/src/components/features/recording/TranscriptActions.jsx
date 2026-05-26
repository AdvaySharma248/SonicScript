// ===========================================
// TranscriptActions — Copy / Download / Save / Clear
// ===========================================
//
// Action buttons for exporting and managing the completed transcript.
// All buttons are disabled when there's no transcript to act on.
//
// FEATURES:
//   📋 Copy — copies transcript to clipboard with "Copied!" feedback
//   📥 Download — downloads transcript as a .txt file
//   💾 Save — sends transcript to backend API (MongoDB)
//   🗑️ Clear — resets the transcript
// ===========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, downloadAsText } from '../../../utils/downloadTranscript';
import { saveTranscription } from '../../../services/transcriptionApi';

/**
 * TranscriptActions — Export and save buttons for completed transcripts.
 *
 * @param {Object} props
 * @param {string} props.transcript - The full transcript text
 * @param {number} props.duration - Recording duration in seconds
 * @param {number} props.confidence - Average confidence score
 * @param {function} props.onClear - Clear transcript callback
 * @param {boolean} props.hasTranscript - Whether there's text to act on
 */
export default function TranscriptActions({
  transcript,
  duration,
  confidence,
  onClear,
  hasTranscript,
}) {
  // Track button feedback states
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // -------------------------------------------
  // Copy to clipboard
  // -------------------------------------------
  const handleCopy = async () => {
    const success = await copyToClipboard(transcript);
    if (success) {
      setCopied(true);
      // Reset "Copied!" text after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // -------------------------------------------
  // Download as .txt file
  // -------------------------------------------
  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    downloadAsText(transcript, `sonicscript-${timestamp}.txt`);
  };

  // -------------------------------------------
  // Save to MongoDB via backend API
  // -------------------------------------------
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      await saveTranscription({
        transcript,
        audioFileName: `recording-${Date.now()}.webm`,
        audioDuration: duration,
        source: 'microphone',
        language: 'en-US',
        confidence: confidence || null,
      });

      setSaved(true);
      // Reset success state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setSaveError(error.message);
      // Clear error after 5 seconds
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      id="transcript-actions"
      className="flex flex-wrap items-center justify-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      {/* Copy Button */}
      <motion.button
        id="btn-copy"
        onClick={handleCopy}
        disabled={!hasTranscript}
        className={`
          px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer
          ${!hasTranscript
            ? 'text-sonic-text-dim/30 border-sonic-border/30 cursor-not-allowed'
            : copied
              ? 'text-sonic-success border-sonic-success/30 bg-sonic-success/10'
              : 'text-sonic-text-dim border-sonic-border hover:text-sonic-text hover:border-sonic-border-hover hover:bg-white/5'
          }
        `}
        whileTap={hasTranscript ? { scale: 0.95 } : {}}
      >
        {copied ? '✓ Copied!' : '📋 Copy'}
      </motion.button>

      {/* Download Button */}
      <motion.button
        id="btn-download"
        onClick={handleDownload}
        disabled={!hasTranscript}
        className={`
          px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer
          ${!hasTranscript
            ? 'text-sonic-text-dim/30 border-sonic-border/30 cursor-not-allowed'
            : 'text-sonic-text-dim border-sonic-border hover:text-sonic-text hover:border-sonic-border-hover hover:bg-white/5'
          }
        `}
        whileTap={hasTranscript ? { scale: 0.95 } : {}}
      >
        📥 Download
      </motion.button>

      {/* Save to Database Button */}
      <motion.button
        id="btn-save"
        onClick={handleSave}
        disabled={!hasTranscript || saving || saved}
        className={`
          px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer
          ${!hasTranscript || saving
            ? 'text-sonic-text-dim/30 border-sonic-border/30 cursor-not-allowed'
            : saved
              ? 'text-sonic-success border-sonic-success/30 bg-sonic-success/10'
              : 'text-sonic-accent border-sonic-accent/30 hover:bg-sonic-accent/10 hover:border-sonic-accent/50'
          }
        `}
        whileTap={hasTranscript && !saving ? { scale: 0.95 } : {}}
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <motion.span
              className="inline-block w-3.5 h-3.5 border-2 border-sonic-accent/30 border-t-sonic-accent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Saving...
          </span>
        ) : saved ? (
          '✓ Saved!'
        ) : (
          '💾 Save'
        )}
      </motion.button>

      {/* Clear Button */}
      <motion.button
        id="btn-clear"
        onClick={onClear}
        disabled={!hasTranscript}
        className={`
          px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer
          ${!hasTranscript
            ? 'text-sonic-text-dim/30 border-sonic-border/30 cursor-not-allowed'
            : 'text-red-400/70 border-red-500/20 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5'
          }
        `}
        whileTap={hasTranscript ? { scale: 0.95 } : {}}
      >
        🗑 Clear
      </motion.button>

      {/* Save Error Message */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            className="w-full text-center text-xs text-red-400 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ❌ {saveError}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
