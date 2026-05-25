// ===========================================
// Transcription Controller — CRUD Operations
// ===========================================
//
// WHAT IS CRUD?
// -------------
// CRUD stands for the four basic database operations:
//   C — Create (save new data)
//   R — Read (get existing data)
//   U — Update (modify existing data)
//   D — Delete (remove data)
//
// Every API you'll ever build uses some combination of CRUD.
// For Day 3, we implement Create, Read, and Delete.
// (Update will be added when we need to edit transcriptions)
//
// CONTROLLER STRUCTURE:
// ---------------------
// Each function handles ONE specific action:
//   createTranscription  → POST /api/transcriptions
//   getAllTranscriptions  → GET  /api/transcriptions
//   getTranscription     → GET  /api/transcriptions/:id
//   deleteTranscription  → DELETE /api/transcriptions/:id
//   seedTranscriptions   → POST /api/transcriptions/seed (dev helper)
//
// All controllers use catchAsync to handle errors automatically.
// See utils/catchAsync.js for how that works.
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Not using catchAsync → server crashes on database errors
// 2. Forgetting 'await' → you send back a Promise instead of data
// 3. Not checking if findById returns null → crash on missing documents
// 4. Sending response twice → Express throws "headers already sent"
// ===========================================

import Transcription from '../models/Transcription.model.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// ===========================================
// CREATE — Save a new transcription
// ===========================================
// Route: POST /api/transcriptions
// Body:  { transcript, audioFileName, audioDuration, source }
//
// HOW IT WORKS:
// 1. Extract data from the request body (req.body)
// 2. Create a new Transcription document in MongoDB
// 3. MongoDB validates the data against our schema
// 4. If valid → document is saved and returned
// 5. If invalid → Mongoose throws a ValidationError → errorHandler catches it
export const createTranscription = catchAsync(async (req, res, next) => {
  // Destructure the fields we need from the request body
  // Only accept fields we expect — never pass req.body directly!
  // Passing req.body directly is a security risk (mass assignment attack)
  const { transcript, audioFileName, audioDuration, source, language, confidence } = req.body;

  // Create the document in MongoDB
  // Mongoose validates all fields against our schema before saving
  const transcription = await Transcription.create({
    transcript,
    audioFileName,
    audioDuration,
    source,
    language,
    confidence,
  });

  // Send back the created document with 201 (Created) status
  res.status(201).json({
    status: 'success',
    data: {
      transcription,
    },
  });
});

// ===========================================
// READ ALL — Get all transcriptions
// ===========================================
// Route: GET /api/transcriptions
// Query: ?status=completed&sort=-createdAt&limit=10
//
// FEATURES:
// - Sorted by newest first (createdAt: -1)
// - Optional filtering by status
// - Pagination support via limit & page
export const getAllTranscriptions = catchAsync(async (req, res, next) => {
  // -------------------------------------------
  // Build the query filter from query params
  // -------------------------------------------
  // Example: GET /api/transcriptions?status=completed
  // → filter = { status: 'completed' }
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.source) {
    filter.source = req.query.source;
  }

  // -------------------------------------------
  // Pagination
  // -------------------------------------------
  // page=1&limit=10 → skip 0, take 10
  // page=2&limit=10 → skip 10, take 10
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // -------------------------------------------
  // Execute the query
  // -------------------------------------------
  // .find(filter) → find documents matching the filter
  // .sort()       → order by newest first
  // .skip()       → skip documents for pagination
  // .limit()      → limit number of results
  const transcriptions = await Transcription.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination info
  const total = await Transcription.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: transcriptions.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    },
    data: {
      transcriptions,
    },
  });
});

// ===========================================
// READ ONE — Get a single transcription by ID
// ===========================================
// Route: GET /api/transcriptions/:id
//
// :id is a URL parameter — Express extracts it from the URL.
// Example: GET /api/transcriptions/665abc123
// → req.params.id === '665abc123'
export const getTranscription = catchAsync(async (req, res, next) => {
  const transcription = await Transcription.findById(req.params.id);

  // If no document found, Mongoose returns null (not an error)
  // We need to check for this and send a proper 404 response
  if (!transcription) {
    return next(
      new AppError(`No transcription found with ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      transcription,
    },
  });
});

// ===========================================
// DELETE — Remove a transcription
// ===========================================
// Route: DELETE /api/transcriptions/:id
//
// findByIdAndDelete() finds a document by ID and removes it.
// If the ID doesn't exist, it returns null.
export const deleteTranscription = catchAsync(async (req, res, next) => {
  const transcription = await Transcription.findByIdAndDelete(req.params.id);

  if (!transcription) {
    return next(
      new AppError(`No transcription found with ID: ${req.params.id}`, 404)
    );
  }

  // 200 with a success message (some APIs use 204 No Content,
  // but we send a message so the frontend can confirm what happened)
  res.status(200).json({
    status: 'success',
    message: 'Transcription deleted successfully',
    data: null,
  });
});

// ===========================================
// SEED — Create dummy data for testing
// ===========================================
// Route: POST /api/transcriptions/seed
//
// This is a development-only helper! It creates sample
// transcriptions so you can test the API without manually
// typing test data every time.
//
// In production, you would remove or protect this route.
export const seedTranscriptions = catchAsync(async (req, res, next) => {
  // Sample dummy data that mimics real transcriptions
  const dummyData = [
    {
      transcript:
        'Hello and welcome to SonicScript. This is the first test transcription recorded directly from the browser microphone. The speech recognition engine has converted my voice into text in real time.',
      audioFileName: 'welcome-recording.mp3',
      audioDuration: 18.5,
      source: 'microphone',
      status: 'completed',
      language: 'en-US',
      confidence: 0.95,
    },
    {
      transcript:
        'Today we are going to discuss the benefits of using MongoDB with Node.js. MongoDB stores data as flexible JSON-like documents, making it a natural fit for JavaScript applications.',
      audioFileName: 'mongodb-lecture.wav',
      audioDuration: 25.3,
      source: 'upload',
      status: 'completed',
      language: 'en-US',
      confidence: 0.88,
    },
    {
      transcript:
        'Meeting notes from the product standup. We discussed the new transcription feature, the timeline for deployment, and the upcoming user testing phase scheduled for next week.',
      audioFileName: 'standup-meeting-2026-05-25.m4a',
      audioDuration: 42.7,
      source: 'upload',
      status: 'completed',
      language: 'en-US',
      confidence: 0.92,
    },
    {
      transcript:
        'Quick voice memo: remember to add error handling to the transcription controller, update the environment variables documentation, and test the delete endpoint with Postman.',
      audioFileName: 'voice-memo-todo.webm',
      audioDuration: 8.2,
      source: 'microphone',
      status: 'completed',
      language: 'en-US',
      confidence: 0.97,
    },
    {
      transcript: '',
      audioFileName: 'corrupted-audio-file.mp3',
      audioDuration: 3.0,
      source: 'upload',
      status: 'failed',
      language: 'en-US',
      confidence: 0,
    },
  ];

  // Fix: the failed one needs a transcript to pass validation
  // Let's give it a placeholder since transcript is required
  dummyData[4].transcript = '[Transcription failed — audio could not be processed]';

  // Insert all documents at once (much faster than creating one by one)
  const transcriptions = await Transcription.insertMany(dummyData);

  res.status(201).json({
    status: 'success',
    message: `🌱 ${transcriptions.length} dummy transcriptions created!`,
    results: transcriptions.length,
    data: {
      transcriptions,
    },
  });
});
