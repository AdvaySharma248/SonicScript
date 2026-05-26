// ===========================================
// TranscriptionDisplay — Live Transcript Area
// ===========================================
//
// This component shows the transcribed text in real time.
// It has several sophisticated features:
//
// 1. STREAMING TEXT: finalTranscript shows as solid white text,
//    interimTranscript shows as dimmed/italic (still being processed)
//
// 2. AUTO-SCROLL: As new text appears, the container automatically
//    scrolls to the bottom so the latest text is always visible
//
// 3. EDITABLE MODE: Users can click to edit the transcript manually
//    (useful for fixing recognition mistakes)
//
// 4. EMPTY STATE: Shows a helpful placeholder when there's no text yet
//
// 5. WORD ANIMATION: New words fade in for a polished streaming effect
// ===========================================

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TranscriptionDisplay — Shows live transcription with auto-scroll.
 *
 * @param {Object} props
 * @param {string} props.finalTranscript - Confirmed text
 * @param {string} props.interimTranscript - In-progress text
 * @param {boolean} props.isListening - Whether currently recording
 * @param {function} props.onTranscriptEdit - Called when user manually edits text
 */
export default function TranscriptionDisplay({
  finalTranscript,
  interimTranscript,
  isListening,
  onTranscriptEdit,
}) {
  // Ref to the scrollable container — used for auto-scrolling
  const containerRef = useRef(null);

  // Track whether the user is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Track the edited text (only used in edit mode)
  const [editedText, setEditedText] = useState('');

  // Track previous word count to only animate NEW words
  const [prevWordCount, setPrevWordCount] = useState(0);

  // -------------------------------------------
  // Auto-scroll to bottom when new text appears
  // -------------------------------------------
  useEffect(() => {
    if (containerRef.current && !isEditing) {
      // scrollTop = scrollHeight makes the container scroll to the very bottom
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [finalTranscript, interimTranscript, isEditing]);

  // -------------------------------------------
  // Track word count for animation
  // -------------------------------------------
  useEffect(() => {
    if (finalTranscript) {
      const currentWordCount = finalTranscript.split(/\s+/).filter(Boolean).length;
      setPrevWordCount(currentWordCount);
    }
  }, [finalTranscript]);

  // -------------------------------------------
  // Handle entering edit mode
  // -------------------------------------------
  const handleEditStart = () => {
    if (!isListening) {
      setIsEditing(true);
      setEditedText(finalTranscript);
    }
  };

  // -------------------------------------------
  // Handle saving edits
  // -------------------------------------------
  const handleEditSave = () => {
    setIsEditing(false);
    if (onTranscriptEdit && editedText !== finalTranscript) {
      onTranscriptEdit(editedText);
    }
  };

  // -------------------------------------------
  // Split transcript into words for animation
  // -------------------------------------------
  const words = finalTranscript ? finalTranscript.split(/\s+/).filter(Boolean) : [];

  // Check if there's any content to show
  const hasContent = finalTranscript || interimTranscript;

  return (
    <motion.div
      id="transcription-display"
      className="glass-card p-6 sm:p-8 w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      // Disable the hover transform from glass-card since this is a content area
      style={{ transform: 'none' }}
      whileHover={{ transform: 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-sonic-text-dim uppercase tracking-widest">
          Transcription
        </h3>

        {/* Edit / Save button (only when there's text and not recording) */}
        {hasContent && !isListening && (
          <button
            id="edit-transcript-btn"
            onClick={isEditing ? handleEditSave : handleEditStart}
            className="text-xs font-medium text-sonic-accent hover:text-sonic-accent-light transition-colors px-3 py-1 rounded-lg hover:bg-sonic-accent/10"
          >
            {isEditing ? '✓ Save' : '✎ Edit'}
          </button>
        )}
      </div>

      {/* Transcript Content Area */}
      <div
        ref={containerRef}
        className="min-h-[120px] max-h-[300px] overflow-y-auto pr-2 scroll-smooth"
      >
        {isEditing ? (
          // ----- EDIT MODE: Textarea -----
          <textarea
            id="transcript-editor"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[120px] bg-transparent text-sonic-text text-base leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-sonic-accent/30 rounded-lg p-2"
            autoFocus
          />
        ) : hasContent ? (
          // ----- DISPLAY MODE: Animated text -----
          <div className="text-base leading-relaxed">
            {/* Final transcript words — solid white text */}
            {words.map((word, index) => (
              <motion.span
                key={`${index}-${word}`}
                className="text-sonic-text inline"
                initial={index >= prevWordCount ? { opacity: 0, y: 5 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index >= prevWordCount ? 0.02 * (index - prevWordCount) : 0 }}
              >
                {word}{' '}
              </motion.span>
            ))}

            {/* Interim transcript — dimmed italic text (still processing) */}
            {interimTranscript && (
              <motion.span
                className="text-sonic-text-dim italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {interimTranscript}
              </motion.span>
            )}

            {/* Blinking cursor when listening */}
            {isListening && (
              <motion.span
                className="inline-block w-0.5 h-5 bg-sonic-accent ml-1 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        ) : (
          // ----- EMPTY STATE -----
          <div className="flex items-center justify-center h-[120px]">
            <p className="text-sonic-text-dim text-sm text-center">
              {isListening
                ? 'Speak now... your words will appear here'
                : 'Click the microphone button to start transcribing'}
            </p>
          </div>
        )}
      </div>

      {/* Word count (only when there's text) */}
      <AnimatePresence>
        {hasContent && !isEditing && (
          <motion.div
            className="mt-4 pt-3 border-t border-sonic-border flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-xs text-sonic-text-dim">
              {words.length} {words.length === 1 ? 'word' : 'words'}
            </span>
            {isListening && (
              <span className="text-xs text-sonic-success flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sonic-success animate-pulse" />
                Live
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
