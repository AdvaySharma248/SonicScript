// ===========================================
// Upload Controller — Handles File Upload Logic
// ===========================================
//
// WHAT IS A CONTROLLER?
// ---------------------
// In the MVC (Model-View-Controller) pattern:
// - Route = "WHERE does the request go?" (URL mapping)
// - Controller = "WHAT happens when it gets there?" (business logic)
// - Model = "HOW is data stored?" (database schema)
//
// Keeping logic in controllers (instead of routes) makes your code:
// ✅ Easier to read — routes are clean one-liners
// ✅ Easier to test — you can test controllers independently
// ✅ Easier to reuse — the same logic can be used by multiple routes
//
// WHAT DOES THIS CONTROLLER DO?
// -----------------------------
// 1. Checks that a file was actually received (Multer attaches it to req.file)
// 2. Extracts file metadata (name, size, type, path)
// 3. Returns a success response with file details
//
// In future days, this is where we'll add:
// - Sending the file to Deepgram for transcription
// - Saving the transcription to MongoDB
// ===========================================

import AppError from '../utils/AppError.js';

/**
 * @desc    Upload an audio file
 * @route   POST /api/upload
 * @access  Public (for now — we'll add auth later)
 */
export const uploadAudio = (req, res, next) => {
  try {
    // -------------------------------------------
    // Step 1: Check if a file was received
    // -------------------------------------------
    // If Multer accepted a file, it attaches it to req.file
    // If no file was sent, req.file will be undefined
    if (!req.file) {
      throw new AppError(
        'No audio file provided. Please upload an audio file using the "audio" field.',
        400
      );
    }

    // -------------------------------------------
    // Step 2: Extract file information
    // -------------------------------------------
    // Multer provides these properties on req.file:
    // - originalname: the file's original name (e.g., "my-recording.mp3")
    // - filename: the new unique name we generated (e.g., "1716556800000-a1b2c3.mp3")
    // - mimetype: the file's MIME type (e.g., "audio/mpeg")
    // - size: file size in bytes
    // - path: full path where the file was saved on disk
    // - destination: the uploads directory path
    const { originalname, filename, mimetype, size, path: filePath } = req.file;

    // -------------------------------------------
    // Step 3: Send success response
    // -------------------------------------------
    console.log(`✅ File uploaded successfully: ${originalname} → ${filename}`);

    res.status(200).json({
      status: 'success',
      message: '🎙️ Audio file uploaded successfully!',
      file: {
        originalName: originalname,
        savedAs: filename,
        mimeType: mimetype,
        sizeInBytes: size,
        sizeFormatted: formatFileSize(size),
        uploadPath: filePath,
      },
    });
  } catch (error) {
    // Pass the error to the centralized error handler
    next(error);
  }
};

// -------------------------------------------
// Helper: Format file size to human-readable
// -------------------------------------------
// Converts bytes → KB/MB for display
// Example: 1048576 → "1.00 MB"
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
