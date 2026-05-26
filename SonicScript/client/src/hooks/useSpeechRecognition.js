// ===========================================
// useSpeechRecognition — Custom React Hook
// ===========================================
//
// WHAT IS THE WEB SPEECH API?
// ----------------------------
// The Web Speech API is a FREE browser-built-in feature that converts
// your voice into text. No API keys, no billing, no servers needed.
// The browser itself does all the heavy lifting!
//
// It has two main parts:
//   1. SpeechRecognition — converts speech → text (what we use)
//   2. SpeechSynthesis — converts text → speech (text-to-speech)
//
// HOW DOES SpeechRecognition WORK?
// ---------------------------------
// 1. You create a SpeechRecognition instance
// 2. You configure it (language, continuous mode, interim results)
// 3. You call .start() — the browser asks for microphone permission
// 4. As you speak, the browser fires "result" events with transcribed text
// 5. You call .stop() — the browser stops listening
//
// KEY CONCEPTS FOR BEGINNERS:
// ----------------------------
// • continuous mode: When true, the engine keeps listening after each
//   sentence. When false, it stops after the first pause in speech.
//
// • interim results: When true, you get "in-progress" text that updates
//   as the engine refines its understanding. When false, you only get
//   the final confirmed text after a pause.
//
// • final results: Text that the engine is confident about. This won't
//   change anymore. It appears after each natural pause in speech.
//
// BROWSER SUPPORT:
// -----------------
// ✅ Chrome (desktop & Android) — full support
// ✅ Edge — full support (uses Chromium engine)
// ✅ Samsung Internet — full support
// ⚠️ Safari — partial support (limited, may not work well)
// ❌ Firefox — NO support (Firefox does not implement this API)
//
// WHY A CUSTOM HOOK?
// -------------------
// Instead of writing all this logic inside every component, we wrap
// it in a hook. Now ANY component can do speech recognition by simply:
//   const { startListening, transcript } = useSpeechRecognition();
// ===========================================

import { useState, useRef, useCallback, useEffect } from 'react';

// -------------------------------------------
// Check if the browser supports speech recognition
// -------------------------------------------
// Different browsers use different names for the API.
// Chrome uses 'webkitSpeechRecognition', newer browsers may use 'SpeechRecognition'.
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * useSpeechRecognition — Encapsulates the entire Web Speech API lifecycle.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.language - BCP 47 language code (default: 'en-US')
 * @param {boolean} options.continuous - Keep listening after pauses (default: true)
 * @param {boolean} options.interimResults - Show in-progress text (default: true)
 *
 * @returns {Object} Hook state and control functions
 */
const useSpeechRecognition = (options = {}) => {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
  } = options;

  // -------------------------------------------
  // State Variables
  // -------------------------------------------

  // The current status of the speech recognition engine
  // Possible values: 'idle' | 'listening' | 'paused' | 'stopped' | 'error'
  const [status, setStatus] = useState('idle');

  // The confirmed text — this is the "done" text that won't change
  const [finalTranscript, setFinalTranscript] = useState('');

  // The in-progress text — updates in real time while you're still speaking
  const [interimTranscript, setInterimTranscript] = useState('');

  // Average confidence score from the engine (0 = not confident, 1 = very confident)
  const [confidence, setConfidence] = useState(0);

  // Error object: { code: string, message: string } or null
  const [error, setError] = useState(null);

  // How long we've been recording (in seconds)
  const [elapsedTime, setElapsedTime] = useState(0);

  // Is the browser supported?
  const [isSupported] = useState(!!SpeechRecognition);

  // -------------------------------------------
  // Refs (values that persist without re-rendering)
  // -------------------------------------------

  // The SpeechRecognition instance itself
  // We use useRef because we don't want React to re-render when this changes
  const recognitionRef = useRef(null);

  // Timer interval ID for the recording timer
  const timerRef = useRef(null);

  // Store the final transcript in a ref too, so event handlers always
  // have access to the latest value (closures can be stale in event handlers)
  const finalTranscriptRef = useRef('');

  // Track total confidence scores for averaging
  const confidenceScoresRef = useRef([]);

  // Track whether we intentionally paused (vs the engine stopping on its own)
  const isPausedRef = useRef(false);

  // -------------------------------------------
  // Timer Functions
  // -------------------------------------------

  // Start counting seconds
  const startTimer = useCallback(() => {
    // Clear any existing timer first
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000); // Update every second
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // -------------------------------------------
  // Error Handler Helper
  // -------------------------------------------
  // Converts cryptic browser error codes into friendly messages
  const getErrorMessage = useCallback((errorCode) => {
    const errorMessages = {
      'not-allowed':
        '🎤 Microphone permission denied. Please allow microphone access in your browser settings and try again.',
      'no-speech':
        '🔇 No speech detected. Please speak louder or check your microphone.',
      'audio-capture':
        '🔌 No microphone found. Please connect a microphone and try again.',
      'network':
        '🌐 Network error. Speech recognition requires an internet connection in most browsers.',
      'aborted':
        '⏹️ Speech recognition was stopped.',
      'service-not-allowed':
        '🚫 Speech recognition service is not allowed. Please try again.',
      'language-not-supported':
        '🌍 The selected language is not supported by your browser.',
    };

    return (
      errorMessages[errorCode] ||
      `❌ Speech recognition error: ${errorCode}. Please try again.`
    );
  }, []);

  // -------------------------------------------
  // Initialize the SpeechRecognition instance
  // -------------------------------------------
  const createRecognition = useCallback(() => {
    if (!SpeechRecognition) return null;

    // Create a new instance of the browser's speech recognition
    const recognition = new SpeechRecognition();

    // ----- Configuration -----

    // Language: tells the engine what language to expect
    // BCP 47 format: 'en-US', 'es-ES', 'hi-IN', 'fr-FR', etc.
    recognition.lang = language;

    // Continuous mode: when true, the engine keeps listening after
    // each sentence/pause. When false, it stops after one result.
    // We want TRUE so users can speak for as long as they want.
    recognition.continuous = continuous;

    // Interim results: when true, we get partial text that updates
    // in real-time as the engine processes speech. This creates
    // that cool "live typing" effect users love.
    recognition.interimResults = interimResults;

    // Max alternatives: how many alternative transcriptions to generate
    // per result. We only need the best one (index 0).
    recognition.maxAlternatives = 1;

    // ----- Event Handlers -----

    // ONRESULT — Fired every time the engine has new text
    // This is where the magic happens!
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      // The event.results is an array of SpeechRecognitionResult objects.
      // Each result has:
      //   .isFinal — true if the engine is confident and done with this chunk
      //   [0].transcript — the actual text
      //   [0].confidence — confidence score (0 to 1)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          // This text is confirmed — add it to our final transcript
          final += transcript;

          // Track confidence scores for averaging
          if (result[0].confidence) {
            confidenceScoresRef.current.push(result[0].confidence);
          }
        } else {
          // This text is still being refined — it's interim
          interim += transcript;
        }
      }

      // Update final transcript (append new final text to existing)
      if (final) {
        finalTranscriptRef.current += final;
        setFinalTranscript(finalTranscriptRef.current);

        // Calculate average confidence
        const scores = confidenceScoresRef.current;
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          setConfidence(Math.round(avg * 100) / 100); // Round to 2 decimals
        }
      }

      // Update interim transcript (replace, not append — it's always changing)
      setInterimTranscript(interim);
    };

    // ONERROR — Fired when something goes wrong
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      // 'aborted' errors happen when we intentionally stop — ignore them
      if (event.error === 'aborted') return;

      // 'no-speech' in continuous mode — just keep listening
      if (event.error === 'no-speech' && continuous) return;

      const message = getErrorMessage(event.error);
      setError({ code: event.error, message });
      setStatus('error');
      stopTimer();
    };

    // ONEND — Fired when the recognition session ends
    // This can happen for several reasons:
    //   1. We called .stop() intentionally
    //   2. The browser stopped it (timeout, error, etc.)
    //   3. The user stopped speaking in non-continuous mode
    recognition.onend = () => {
      // If we paused intentionally, don't change status
      if (isPausedRef.current) return;

      // In continuous mode, the browser sometimes stops on its own
      // (e.g., after a long silence). We restart it automatically.
      if (continuous && recognitionRef.current && !isPausedRef.current) {
        // Check if we're supposed to still be listening
        setStatus((currentStatus) => {
          if (currentStatus === 'listening') {
            try {
              recognition.start();
            } catch (e) {
              // Already started or other error — ignore
            }
            return 'listening';
          }
          stopTimer();
          return 'stopped';
        });
        return;
      }

      setStatus('stopped');
      stopTimer();
    };

    // ONSTART — Fired when recognition starts successfully
    recognition.onstart = () => {
      setStatus('listening');
      setError(null);
    };

    return recognition;
  }, [language, continuous, interimResults, getErrorMessage, stopTimer]);

  // -------------------------------------------
  // Control Functions
  // -------------------------------------------

  // START — Begin listening
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setError({
        code: 'not-supported',
        message:
          '🌐 Your browser does not support speech recognition. Please use Google Chrome or Microsoft Edge for the best experience.',
      });
      setStatus('error');
      return;
    }

    // Clear any previous error
    setError(null);

    // Reset transcripts for a fresh recording
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    confidenceScoresRef.current = [];
    setConfidence(0);
    setElapsedTime(0);
    isPausedRef.current = false;

    // Create a fresh recognition instance
    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    try {
      // This triggers the browser's microphone permission prompt
      // if the user hasn't granted permission yet
      recognition.start();
      startTimer();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError({
        code: 'start-failed',
        message: '❌ Failed to start speech recognition. Please try again.',
      });
      setStatus('error');
    }
  }, [createRecognition, startTimer]);

  // STOP — End listening completely
  const stopListening = useCallback(() => {
    isPausedRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped — ignore
      }
      recognitionRef.current = null;
    }

    setStatus('stopped');
    setInterimTranscript('');
    stopTimer();
  }, [stopTimer]);

  // PAUSE — Temporarily stop listening (preserves transcript)
  const pauseListening = useCallback(() => {
    isPausedRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped — ignore
      }
    }

    setStatus('paused');
    setInterimTranscript('');
    stopTimer();
  }, [stopTimer]);

  // RESUME — Continue listening after a pause
  const resumeListening = useCallback(() => {
    if (!SpeechRecognition) return;

    isPausedRef.current = false;
    setError(null);

    // Create a new recognition instance (can't reuse after stop)
    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    try {
      recognition.start();
      startTimer();
    } catch (err) {
      console.error('Failed to resume speech recognition:', err);
      setError({
        code: 'resume-failed',
        message: '❌ Failed to resume. Please try again.',
      });
      setStatus('error');
    }
  }, [createRecognition, startTimer]);

  // RESET — Clear all transcript data
  const resetTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    confidenceScoresRef.current = [];
    setConfidence(0);
    setElapsedTime(0);
    setError(null);
    setStatus('idle');
  }, []);

  // -------------------------------------------
  // Cleanup on unmount
  // -------------------------------------------
  // When the component using this hook is removed from the page,
  // we need to stop everything to prevent memory leaks
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // -------------------------------------------
  // Return everything the component needs
  // -------------------------------------------
  return {
    // State
    status,          // 'idle' | 'listening' | 'paused' | 'stopped' | 'error'
    finalTranscript, // The confirmed transcribed text
    interimTranscript, // The in-progress text (updates live)
    confidence,      // Average confidence score (0 to 1)
    error,           // { code, message } or null
    elapsedTime,     // Recording duration in seconds
    isSupported,     // Whether the browser supports speech recognition

    // Derived booleans for convenience
    isListening: status === 'listening',
    isPaused: status === 'paused',
    isStopped: status === 'stopped',
    hasTranscript: finalTranscript.length > 0,

    // Control functions
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
