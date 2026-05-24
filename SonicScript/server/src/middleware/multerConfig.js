// ===========================================
// Multer Configuration — Audio File Uploads
// ===========================================
//
// WHAT IS MULTER?
// ---------------
// Multer is a middleware for handling "multipart/form-data", which is
// the format used when uploading files from a browser. When you select
// a file in an <input type="file"> element and submit, the browser sends
// it as multipart/form-data. Multer catches that and saves the file.
//
// Without Multer, Express can't handle file uploads — it only understands
// JSON and URL-encoded data by default.
//
// HOW DOES IT WORK?
// -----------------
// 1. A user sends a POST request with an audio file attached
// 2. Multer intercepts the request BEFORE it reaches your route handler
// 3. Multer saves the file to the "uploads/" folder on disk
// 4. Multer attaches file metadata to `req.file` so your code can access it
//
// WHAT WE CONFIGURE HERE:
// -----------------------
// - WHERE to store files (disk storage in "uploads/" folder)
// - HOW to name files (unique names to prevent overwriting)
// - WHAT file types are allowed (audio only — no images, PDFs, etc.)
// - HOW BIG files can be (25 MB max)
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting to create the "uploads/" folder → Multer will throw an error
// 2. Not matching the field name in Postman with the one in multer
//    → If multer expects "audio", you must use "audio" as the field name
// 3. Not handling Multer errors → the app crashes instead of sending an error
// ===========================================

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// -------------------------------------------
// Fix for ES Modules: __dirname doesn't exist
// -------------------------------------------
// In CommonJS (require), Node gives you __dirname for free.
// In ES modules (import), you need to calculate it manually.
// This is a common gotcha that trips up many beginners!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------
// Allowed audio MIME types
// -------------------------------------------
// MIME types are like "labels" that tell the computer what kind of file
// something is. "audio/mpeg" means MP3, "audio/wav" means WAV, etc.
const ALLOWED_MIME_TYPES = [
  'audio/mpeg',         // .mp3
  'audio/mp3',          // .mp3 (alternative)
  'audio/wav',          // .wav
  'audio/x-wav',        // .wav (alternative)
  'audio/wave',         // .wav (alternative)
  'audio/mp4',          // .m4a
  'audio/x-m4a',        // .m4a (alternative)
  'audio/ogg',          // .ogg
  'audio/webm',         // .webm
  'audio/flac',         // .flac
  'audio/x-flac',       // .flac (alternative)
  'audio/aac',          // .aac
];

// Allowed file extensions (as a backup check)
const ALLOWED_EXTENSIONS = [
  '.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac', '.aac',
];

// Maximum file size: 25 MB (in bytes)
// 25 * 1024 * 1024 = 26,214,400 bytes
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// -------------------------------------------
// Storage Configuration
// -------------------------------------------
// diskStorage() tells Multer to save files to the hard drive
// (as opposed to memoryStorage() which keeps them in RAM)
const storage = multer.diskStorage({
  // WHERE to save the file
  destination: (req, file, cb) => {
    // path.resolve() creates an absolute path to the uploads folder
    // Going up two directories: middleware/ → src/ → server/uploads/
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },

  // WHAT to name the file
  filename: (req, file, cb) => {
    // We generate a unique filename to prevent overwriting:
    // Example: 1716556800000-a1b2c3d4e5f6.mp3
    //
    // Why not use the original filename?
    // → Two users could upload "recording.mp3" and the second would
    //   overwrite the first. Unique names prevent this.
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// -------------------------------------------
// File Filter — Accept ONLY audio files
// -------------------------------------------
// This runs BEFORE the file is saved. If we reject it here,
// it never touches the disk.
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // Check both MIME type AND extension for extra security
  // (MIME types can be spoofed, so checking extension too is safer)
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(extension)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with a descriptive error
    const error = new Error(
      `Invalid file type: "${file.originalname}". ` +
      `Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`
    );
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// -------------------------------------------
// Create the configured Multer instance
// -------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 25 MB
  },
});

export default upload;
