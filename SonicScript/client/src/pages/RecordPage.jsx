// ===========================================
// RecordPage — The Main Recording Experience
// ===========================================
//
// This is the hero page of Day 4 — the complete recording studio
// where users can:
//   1. Click a glowing mic button to start recording
//   2. See live transcription appear in real time
//   3. Pause, resume, and stop recording
//   4. Copy, download, or save their transcript to MongoDB
//
// ARCHITECTURE:
// --------------
// This page component is the "orchestrator" — it uses the
// useSpeechRecognition hook for all speech logic and passes
// data down to child components that handle specific UI pieces.
//
// DATA FLOW:
//   useSpeechRecognition hook → RecordPage (state) → Child components (props)
//   User clicks → RecordPage handlers → hook functions → state updates → re-render
// ===========================================

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Custom hook — the brain of speech recognition
import useSpeechRecognition from '../hooks/useSpeechRecognition';

// Recording sub-components — each handles one piece of the UI
import MicrophoneButton from '../components/features/recording/MicrophoneButton';
import WaveformVisualizer from '../components/features/recording/WaveformVisualizer';
import StatusIndicator from '../components/features/recording/StatusIndicator';
import TranscriptionDisplay from '../components/features/recording/TranscriptionDisplay';
import RecordingTimer from '../components/features/recording/RecordingTimer';
import RecordingControls from '../components/features/recording/RecordingControls';
import TranscriptActions from '../components/features/recording/TranscriptActions';
import ErrorAlert from '../components/features/recording/ErrorAlert';

/**
 * RecordPage — Full-page recording studio experience.
 */
export default function RecordPage() {
  // -------------------------------------------
  // Initialize the speech recognition hook
  // -------------------------------------------
  // This gives us all the state and functions we need
  const {
    status,
    finalTranscript,
    interimTranscript,
    confidence,
    error,
    elapsedTime,
    isSupported,
    isListening,
    isPaused,
    hasTranscript,
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    resetTranscript,
  } = useSpeechRecognition({ language: 'en-US' });

  // -------------------------------------------
  // Local state for managing the transcript text
  // -------------------------------------------
  // We keep a local copy so users can edit it after recording
  const [editedTranscript, setEditedTranscript] = useState(null);

  // The transcript to display — either the edited version or the live one
  const displayTranscript = editedTranscript !== null ? editedTranscript : finalTranscript;

  // -------------------------------------------
  // Handlers
  // -------------------------------------------

  // Handle microphone button click — toggles between start and stop
  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else if (isPaused) {
      resumeListening();
    } else {
      setEditedTranscript(null); // Clear any previous edits
      startListening();
    }
  }, [isListening, isPaused, startListening, stopListening, resumeListening]);

  // Handle transcript manual edit
  const handleTranscriptEdit = useCallback((newText) => {
    setEditedTranscript(newText);
  }, []);

  // Handle clear/reset
  const handleReset = useCallback(() => {
    resetTranscript();
    setEditedTranscript(null);
  }, [resetTranscript]);

  // Handle error dismiss
  const handleDismissError = useCallback(() => {
    // Reset to idle state when error is dismissed
    resetTranscript();
  }, [resetTranscript]);

  // -------------------------------------------
  // Staggered page entrance animation
  // -------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each child animates 0.1s after the previous
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // -------------------------------------------
  // Browser Not Supported Screen
  // -------------------------------------------
  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-sonic-dark">
        <motion.div
          className="glass-card p-8 sm:p-12 max-w-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-6">🌐</div>
          <h2 className="text-2xl font-bold text-sonic-text mb-4">
            Browser Not Supported
          </h2>
          <p className="text-sonic-text-dim leading-relaxed mb-6">
            Your browser doesn't support the Web Speech API. For the best
            experience, please use{' '}
            <span className="text-sonic-accent font-medium">Google Chrome</span> or{' '}
            <span className="text-sonic-accent font-medium">Microsoft Edge</span>.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------
  // Main Recording Page
  // -------------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs — same as landing page for consistency */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Page Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <motion.header
          className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back to home */}
          <Link
            to="/"
            id="back-to-home"
            className="flex items-center gap-2 text-sm text-sonic-text-dim hover:text-sonic-text transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-lg font-bold">
              <span className="gradient-text">Sonic</span>
              <span className="text-sonic-text">Script</span>
            </span>
          </Link>
        </motion.header>

        {/* Main Content — Staggered animations */}
        <motion.main
          className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 pt-6 sm:pt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Title */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="gradient-text">Recording Studio</span>
            </h1>
            <p className="text-sm text-sonic-text-dim">
              Speak into your microphone and watch AI transcribe in real time
            </p>
          </motion.div>

          {/* Error Alert */}
          <motion.div variants={itemVariants}>
            <ErrorAlert error={error} onDismiss={handleDismissError} />
          </motion.div>

          {/* Status Indicator */}
          <motion.div className="mb-6" variants={itemVariants}>
            <StatusIndicator status={status} />
          </motion.div>

          {/* Waveform Visualizer */}
          <motion.div className="mb-8" variants={itemVariants}>
            <WaveformVisualizer isListening={isListening} isPaused={isPaused} />
          </motion.div>

          {/* Microphone Button */}
          <motion.div className="flex justify-center mb-6" variants={itemVariants}>
            <MicrophoneButton
              isListening={isListening}
              isPaused={isPaused}
              status={status}
              onClick={handleMicClick}
            />
          </motion.div>

          {/* Recording Timer */}
          <motion.div className="mb-6" variants={itemVariants}>
            <RecordingTimer elapsedTime={elapsedTime} isListening={isListening} />
          </motion.div>

          {/* Recording Controls */}
          <motion.div className="mb-10" variants={itemVariants}>
            <RecordingControls
              status={status}
              onStart={startListening}
              onStop={stopListening}
              onPause={pauseListening}
              onResume={resumeListening}
              onReset={handleReset}
            />
          </motion.div>

          {/* Transcription Display */}
          <motion.div className="mb-6" variants={itemVariants}>
            <TranscriptionDisplay
              finalTranscript={displayTranscript}
              interimTranscript={interimTranscript}
              isListening={isListening}
              onTranscriptEdit={handleTranscriptEdit}
            />
          </motion.div>

          {/* Transcript Actions (Copy, Download, Save, Clear) */}
          <motion.div variants={itemVariants}>
            <TranscriptActions
              transcript={displayTranscript}
              duration={elapsedTime}
              confidence={confidence}
              onClear={handleReset}
              hasTranscript={hasTranscript || (editedTranscript && editedTranscript.length > 0)}
            />
          </motion.div>

          {/* Confidence Score (show when available) */}
          {confidence > 0 && status === 'stopped' && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-sonic-text-dim">
                Average confidence:{' '}
                <span className={`font-semibold ${confidence >= 0.8 ? 'text-sonic-success' : confidence >= 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {Math.round(confidence * 100)}%
                </span>
              </span>
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
