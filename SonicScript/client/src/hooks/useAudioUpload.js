// ===========================================
// useAudioUpload — Hook for Audio File Upload
// ===========================================
//
// Manages the complete upload lifecycle:
//   idle → validating → uploading (with progress) → success/error
//
// Uses Axios's onUploadProgress for real-time progress tracking.
// ===========================================

import { useState, useCallback, useRef } from 'react';
import { uploadAudioFile } from '../services/transcriptionApi';

// Allowed audio MIME types
const ALLOWED_TYPES = [
  'audio/mpeg',      // .mp3
  'audio/wav',       // .wav
  'audio/x-wav',     // .wav (alt)
  'audio/mp4',       // .m4a
  'audio/x-m4a',     // .m4a (alt)
  'audio/webm',      // .webm
  'audio/ogg',       // .ogg
];

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const useAudioUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | validating | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const abortControllerRef = useRef(null);

  // Validate the selected file
  const validateFile = useCallback((selectedFile) => {
    if (!selectedFile) {
      return 'No file selected';
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      return `Unsupported file type: ${selectedFile.type || 'unknown'}. Please upload MP3, WAV, or M4A.`;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File too large (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB). Max size is 50MB.`;
    }

    return null; // No error — valid
  }, []);

  // Select a file (validates it)
  const selectFile = useCallback((selectedFile) => {
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus('validating');

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      setFile(null);
      return false;
    }

    setFile(selectedFile);
    setStatus('idle');
    return true;
  }, [validateFile]);

  // Upload the selected file
  const uploadFile = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await uploadAudioFile(file, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(percent);
        },
        signal: abortControllerRef.current.signal,
      });

      setResult(response);
      setStatus('success');
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setError(err.message || 'Upload failed. Please try again.');
      setStatus('error');
    }
  }, [file]);

  // Cancel an in-progress upload
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setProgress(0);
  }, []);

  // Reset everything to initial state
  const reset = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return {
    file,
    status,
    progress,
    error,
    result,
    selectFile,
    uploadFile,
    cancelUpload,
    reset,
  };
};

export default useAudioUpload;
