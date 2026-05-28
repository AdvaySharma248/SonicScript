// ===========================================
// Transcription API Service — Axios Client
// ===========================================
//
// WHAT IS THIS FILE?
// -------------------
// This is the "communication layer" between the React frontend
// and the Express.js backend. Instead of writing fetch/axios calls
// inside every component, we centralize all API calls here.
//
// WHY AXIOS INSTEAD OF FETCH?
// ----------------------------
// fetch() is built into browsers, but axios gives us:
//   • Automatic JSON parsing (no need for response.json())
//   • Request/response interceptors (add auth headers automatically)
//   • Better error handling (throws on 4xx/5xx status codes)
//   • Request cancellation support
//   • Simpler syntax
//
// HOW TO USE THIS IN A COMPONENT:
// --------------------------------
//   import { saveTranscription } from '../services/transcriptionApi';
//   const result = await saveTranscription({ transcript: '...' });
// ===========================================

import axios from 'axios';

// -------------------------------------------
// Create an Axios instance with default settings
// -------------------------------------------
// VITE_API_URL is set in the client's .env file.
// In development: http://localhost:5000/api
// In production: your deployed server URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds — if the server doesn't respond, give up
});

// ===========================================
// API Functions
// ===========================================

/**
 * Save a new transcription to the database.
 *
 * @param {Object} data - Transcription data to save
 * @param {string} data.transcript - The transcribed text
 * @param {string} data.audioFileName - Name for the audio source
 * @param {number} data.audioDuration - Duration in seconds
 * @param {string} data.source - 'microphone' | 'upload'
 * @param {string} data.language - Language code (e.g., 'en-US')
 * @param {number} data.confidence - Confidence score (0 to 1)
 * @returns {Promise<Object>} The saved transcription document
 */
export const saveTranscription = async (data) => {
  try {
    const response = await api.post('/transcriptions', {
      transcript: data.transcript,
      audioFileName: data.audioFileName || `recording-${Date.now()}.webm`,
      audioDuration: data.audioDuration || 0,
      source: data.source || 'microphone',
      language: data.language || 'en-US',
      confidence: data.confidence || null,
    });

    return response.data;
  } catch (error) {
    // Extract the error message from the server response
    // The server sends: { status: 'fail', message: '...' }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to save transcription. Please try again.';

    throw new Error(message);
  }
};

/**
 * Get all transcriptions from the database.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status ('completed', 'processing', 'failed')
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Results per page
 * @returns {Promise<Object>} { transcriptions, pagination }
 */
export const getTranscriptions = async (params = {}) => {
  try {
    const response = await api.get('/transcriptions', { params });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch transcriptions.';

    throw new Error(message);
  }
};

/**
 * Get a single transcription by ID.
 *
 * @param {string} id - MongoDB document ID
 * @returns {Promise<Object>} The transcription document
 */
export const getTranscription = async (id) => {
  try {
    const response = await api.get(`/transcriptions/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch transcription.';

    throw new Error(message);
  }
};

/**
 * Delete a transcription by ID.
 *
 * @param {string} id - MongoDB document ID
 * @returns {Promise<Object>} Success confirmation
 */
export const deleteTranscription = async (id) => {
  try {
    const response = await api.delete(`/transcriptions/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to delete transcription.';

    throw new Error(message);
  }
};

/**
 * Upload an audio file to the server.
 *
 * Uses multipart/form-data encoding so the server receives the
 * actual file (not a JSON string). Supports progress tracking
 * via Axios's onUploadProgress callback.
 *
 * @param {File} file - The audio file to upload
 * @param {Object} options - Upload options
 * @param {Function} options.onUploadProgress - Progress callback
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @returns {Promise<Object>} Server response with file details
 */
export const uploadAudioFile = async (file, options = {}) => {
  try {
    // FormData is the standard way to send files via HTTP
    // The key 'audio' must match the server's multer field name
    const formData = new FormData();
    formData.append('audio', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onUploadProgress,
      signal: options.signal,
      timeout: 60000, // 60 seconds for large files
    });

    return response.data;
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      throw error; // Re-throw cancellation errors
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to upload audio file.';

    throw new Error(message);
  }
};

export default api;

