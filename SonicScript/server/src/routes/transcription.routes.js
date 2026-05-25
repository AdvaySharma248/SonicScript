// ===========================================
// Transcription Routes — /api/transcriptions
// ===========================================
//
// REST API ROUTE MAP:
// -------------------
// POST   /api/transcriptions       → Create a new transcription
// GET    /api/transcriptions       → Get all transcriptions
// GET    /api/transcriptions/:id   → Get one transcription by ID
// DELETE /api/transcriptions/:id   → Delete one transcription by ID
// POST   /api/transcriptions/seed  → Seed dummy data (dev only)
//
// ROUTE ORGANIZATION:
// -------------------
// Routes are ordered by HTTP method and specificity:
// 1. Collection routes first (/, /seed)
// 2. Individual resource routes second (/:id)
//
// WHY? Express matches routes top-to-bottom. If /:id came before
// /seed, then GET /seed would match /:id with id="seed"!
//
// WHAT IS Express.Router()?
// -------------------------
// Router() creates a mini "sub-application" that handles routes
// for a specific path prefix. In app.js, we mount this router at
// '/api/transcriptions', so:
//   router.get('/')    → GET /api/transcriptions
//   router.get('/:id') → GET /api/transcriptions/abc123
//
// This keeps app.js clean and each feature's routes in their own file.
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting to mount the router in app.js with app.use()
// 2. Putting /:id route BEFORE /seed → "seed" gets matched as an ID
// 3. Using the wrong HTTP method (GET for create, POST for fetch)
// ===========================================

import { Router } from 'express';
import {
  createTranscription,
  getAllTranscriptions,
  getTranscription,
  deleteTranscription,
  seedTranscriptions,
} from '../controllers/transcription.controller.js';

const router = Router();

// -------------------------------------------
// Collection Routes (no :id needed)
// -------------------------------------------

// POST /api/transcriptions — Save a new transcription
// GET  /api/transcriptions — Get all transcriptions
router
  .route('/')
  .post(createTranscription)
  .get(getAllTranscriptions);

// POST /api/transcriptions/seed — Create dummy data
// ⚠️  This MUST come BEFORE the /:id route!
// Otherwise, Express thinks "seed" is an ID.
router.post('/seed', seedTranscriptions);

// -------------------------------------------
// Individual Resource Routes (requires :id)
// -------------------------------------------

// GET    /api/transcriptions/:id — Get one transcription
// DELETE /api/transcriptions/:id — Delete one transcription
router
  .route('/:id')
  .get(getTranscription)
  .delete(deleteTranscription);

export default router;
