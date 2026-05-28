// ===========================================
// UploadPage — Drag & Drop Audio Upload
// ===========================================
//
// Premium upload experience with:
//   - Drag & drop zone with neon border
//   - File validation (MP3, WAV, M4A)
//   - Audio preview player
//   - Upload progress bar
//   - Success/error animations
// ===========================================

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUpload, HiMusicNote, HiX, HiCheck, HiExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';
import PageTransition from '../components/common/PageTransition';
import useAudioUpload from '../hooks/useAudioUpload';
import { saveTranscription } from '../services/transcriptionApi';

export default function UploadPage() {
  const {
    file,
    status,
    progress,
    error,
    result,
    selectFile,
    uploadFile,
    cancelUpload,
    reset,
  } = useAudioUpload();

  const [isDragging, setIsDragging] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  // Handle file selection (from drag or file picker)
  const handleFileSelect = useCallback(
    (selectedFile) => {
      const isValid = selectFile(selectedFile);
      if (isValid) {
        // Create audio preview URL
        const url = URL.createObjectURL(selectedFile);
        setAudioUrl(url);
      }
    },
    [selectFile]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  // Handle upload
  const handleUpload = useCallback(async () => {
    await uploadFile();
  }, [uploadFile]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [audioUrl, reset]);

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">Upload Audio</span>
          </h2>
          <p className="text-sm text-sonic-text-dim">
            Drag & drop your audio files or click to browse. Supports MP3, WAV, and M4A.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="glass-card p-6 sm:p-8 hover:transform-none hover:bg-sonic-card hover:border-sonic-border">
          <AnimatePresence mode="wait">
            {/* STATE: Idle / File Selection */}
            {(status === 'idle' || status === 'validating') && !file && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Drag & Drop Zone */}
                <div
                  className={`dropzone rounded-2xl p-12 sm:p-16 text-center cursor-pointer ${
                    isDragging ? 'drag-over' : ''
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="animate-float mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sonic-accent/20 to-sonic-cyan/20 border border-sonic-accent/20 flex items-center justify-center">
                      <HiUpload className="w-7 h-7 text-sonic-accent-light" />
                    </div>
                  </div>

                  <p className="text-base font-medium text-sonic-text mb-2">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your audio file'}
                  </p>
                  <p className="text-sm text-sonic-text-dim mb-4">
                    or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-sonic-text-dim">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-sonic-border">MP3</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-sonic-border">WAV</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-sonic-border">M4A</span>
                    <span className="text-sonic-text-dim/50 ml-1">Max 50MB</span>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/webm,audio/ogg"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </motion.div>
            )}

            {/* STATE: File Selected — Preview & Upload */}
            {file && (status === 'idle' || status === 'uploading') && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-sonic-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sonic-accent/20 to-sonic-cyan/20 flex items-center justify-center flex-shrink-0">
                    <HiMusicNote className="w-6 h-6 text-sonic-accent-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sonic-text truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-sonic-text-dim">
                      {formatSize(file.size)} • {file.type.split('/')[1]?.toUpperCase()}
                    </p>
                  </div>
                  {status !== 'uploading' && (
                    <button
                      onClick={handleReset}
                      className="p-2 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
                      title="Remove file"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Audio Preview */}
                {audioUrl && (
                  <div className="rounded-xl overflow-hidden border border-sonic-border bg-white/[0.02] p-3">
                    <audio
                      controls
                      src={audioUrl}
                      className="w-full h-10"
                      preload="metadata"
                    />
                  </div>
                )}

                {/* Upload Progress */}
                {status === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sonic-text-dim">Uploading...</span>
                      <span className="text-sonic-accent-light font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="progress-bar h-full rounded-full active"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {status !== 'uploading' && (
                  <button
                    onClick={handleUpload}
                    className="w-full py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-sonic-accent-glow cursor-pointer"
                  >
                    Upload & Transcribe
                  </button>
                )}

                {/* Cancel Button */}
                {status === 'uploading' && (
                  <button
                    onClick={cancelUpload}
                    className="w-full py-3 text-sm font-medium text-sonic-text-dim border border-sonic-border rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel Upload
                  </button>
                )}
              </motion.div>
            )}

            {/* STATE: Success */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-sonic-success/10 border border-sonic-success/20 flex items-center justify-center mb-5">
                  <HiCheck className="w-8 h-8 text-sonic-success" />
                </div>
                <h3 className="text-lg font-semibold text-sonic-text mb-2">
                  Upload Successful!
                </h3>
                <p className="text-sm text-sonic-text-dim mb-6">
                  {result?.file?.originalName || file?.name} has been uploaded.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all cursor-pointer"
                  >
                    Upload Another
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE: Error */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <HiExclamation className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-sonic-text mb-2">
                  Upload Failed
                </h3>
                <p className="text-sm text-red-400 mb-6 max-w-sm mx-auto">
                  {error}
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm font-medium text-sonic-text border border-sonic-border rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Supported Formats Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-sonic-text-dim/60">
            Supported formats: MP3, WAV, M4A, WebM, OGG • Max file size: 50MB
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
