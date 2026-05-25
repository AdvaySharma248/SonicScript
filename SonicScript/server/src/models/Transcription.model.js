// ===========================================
// Transcription Model — Mongoose Schema
// ===========================================
//
// WHAT IS A SCHEMA?
// -----------------
// A schema defines the "blueprint" for every transcription document
// in MongoDB. It specifies:
//   - What fields exist (transcript, audioFileName, etc.)
//   - What type each field is (String, Number, etc.)
//   - Which fields are required vs optional
//   - Validation rules (min/max values, allowed values, etc.)
//   - Default values for optional fields
//
// Think of it like a form template — it defines what blanks
// need to be filled in and what kind of data goes in each blank.
//
// WHAT IS A MODEL?
// ----------------
// A model is a JavaScript class created FROM a schema.
// It gives you methods to interact with the database:
//   Transcription.create()    → Save a new document
//   Transcription.find()      → Get all documents
//   Transcription.findById()  → Get one document by ID
//   Transcription.findByIdAndDelete() → Delete a document
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting to export the model (not the schema!)
// 2. Using 'required: true' without a custom error message
// 3. Not adding timestamps: true (you'd need createdAt/updatedAt manually)
// 4. Naming the model plural — Mongoose auto-pluralizes for the collection
//    → Model: 'Transcription' → Collection: 'transcriptions' (auto!)
// ===========================================

import mongoose from 'mongoose';

// -------------------------------------------
// Define the Transcription Schema
// -------------------------------------------
const transcriptionSchema = new mongoose.Schema(
  {
    // ----- REQUIRED FIELDS -----

    // The actual transcribed text from the audio
    transcript: {
      type: String,
      required: [true, 'Transcript text is required'],
      trim: true, // Removes whitespace from both ends
      minlength: [1, 'Transcript cannot be empty'],
      maxlength: [50000, 'Transcript cannot exceed 50,000 characters'],
    },

    // The name of the original audio file
    audioFileName: {
      type: String,
      required: [true, 'Audio file name is required'],
      trim: true,
    },

    // ----- OPTIONAL FIELDS -----

    // How long the audio clip is (in seconds)
    audioDuration: {
      type: Number,
      default: 0,
      min: [0, 'Audio duration cannot be negative'],
    },

    // Where did the audio come from?
    // enum = only these specific values are allowed
    source: {
      type: String,
      enum: {
        values: ['microphone', 'upload', 'clipboard', 'url'],
        message: "'{VALUE}' is not a valid transcription source. Use: microphone, upload, clipboard, or url",
      },
      default: 'microphone',
    },

    // What's the current state of the transcription?
    status: {
      type: String,
      enum: {
        values: ['processing', 'completed', 'failed'],
        message: "'{VALUE}' is not a valid status. Use: processing, completed, or failed",
      },
      default: 'processing',
    },

    // For future JWT authentication — links a transcription to a user
    // mongoose.Schema.Types.ObjectId is a special type that references
    // another document (like a foreign key in SQL)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model (we'll create this later)
      default: null,
    },

    // The language the audio was spoken in
    language: {
      type: String,
      default: 'en-US',
      trim: true,
    },

    // Confidence score from the speech recognition engine (0 to 1)
    // null means the engine didn't provide a confidence score
    confidence: {
      type: Number,
      min: [0, 'Confidence score cannot be less than 0'],
      max: [1, 'Confidence score cannot be greater than 1'],
      default: null,
    },
  },
  {
    // ----- SCHEMA OPTIONS -----

    // timestamps: true automatically adds two fields:
    //   createdAt — when the document was first created
    //   updatedAt — when it was last modified
    // You don't need to manage these manually!
    timestamps: true,

    // toJSON/toObject: { virtuals: true } ensures virtual fields
    // (like wordCount) appear when you convert the document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// -------------------------------------------
// Virtual Field: wordCount
// -------------------------------------------
// A "virtual" is a field that ISN'T stored in MongoDB but is
// calculated on-the-fly when you access the document.
// It saves storage space — why store what you can calculate?
//
// Example:
//   transcript: "Hello welcome to SonicScript" → wordCount: 4
transcriptionSchema.virtual('wordCount').get(function () {
  if (!this.transcript) return 0;
  return this.transcript.split(/\s+/).filter(Boolean).length;
});

// -------------------------------------------
// Indexes — Speed Up Database Queries
// -------------------------------------------
// An index is like a book's table of contents — it helps MongoDB
// find documents faster without scanning every single one.
//
// We index fields we'll query often:
//   - createdAt: for sorting by newest first
//   - status: for filtering by processing/completed/failed
//   - userId: for finding all transcriptions by a user (future)

transcriptionSchema.index({ createdAt: -1 }); // -1 = descending (newest first)
transcriptionSchema.index({ status: 1 });
transcriptionSchema.index({ userId: 1 });

// -------------------------------------------
// Pre-save Middleware (Hook)
// -------------------------------------------
// This runs BEFORE a document is saved to the database.
// We use it to set the status to 'completed' if transcript exists
// (useful when creating a transcription that's already done)
transcriptionSchema.pre('save', function (next) {
  // If this is a new document and has transcript text,
  // automatically mark it as completed
  if (this.isNew && this.transcript && this.transcript.length > 0) {
    if (this.status === 'processing') {
      this.status = 'completed';
    }
  }
  next();
});

// -------------------------------------------
// Create and Export the Model
// -------------------------------------------
// mongoose.model('Transcription', schema) does two things:
// 1. Creates a 'Transcription' model (class) from our schema
// 2. Tells MongoDB to use a collection called 'transcriptions'
//    (Mongoose auto-pluralizes and lowercases the model name)
const Transcription = mongoose.model('Transcription', transcriptionSchema);

export default Transcription;
