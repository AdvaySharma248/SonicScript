// ===========================================
// Upload Routes — /api/upload
// ===========================================
//
// WHAT IS A ROUTE?
// ----------------
// A route maps a URL pattern + HTTP method to a function (controller).
// Think of it like a receptionist: "Oh, you want to upload a file?
// Let me direct you to the upload handler."
//
// ROUTE STRUCTURE:
// ----------------
//   router.post('/', multerMiddleware, controllerFunction)
//        │         │       │                  │
//        │         │       │                  └─ What to do with the request
//        │         │       └─ Process the uploaded file first
//        │         └─ The path (relative to where this is mounted)
//        └─ The HTTP method (POST for uploading/creating)
//
// Since this router is mounted at "/api/upload" in app.js,
// the full path for this route is: POST /api/upload
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Using the wrong HTTP method: GET is for fetching, POST is for creating/uploading
// 2. Forgetting to put multer BEFORE the controller — the file won't be parsed
// 3. Using a different field name in Postman than what multer.single() expects
//    → We use "audio" here, so in Postman the key must be "audio"
// ===========================================

import { Router } from 'express';
import upload from '../middleware/multerConfig.js';
import { uploadAudio } from '../controllers/upload.controller.js';

const router = Router();

// -------------------------------------------
// POST /api/upload
// -------------------------------------------
// upload.single('audio') tells Multer:
//   "Expect ONE file, and it will be sent under the field name 'audio'"
//
// The flow is:
//   1. Request arrives → Multer processes the file
//   2. File is saved to uploads/ → Multer adds req.file
//   3. uploadAudio controller runs → sends back response
router.post('/', upload.single('audio'), uploadAudio);

export default router;
