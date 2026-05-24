// =============================================
// SonicScript — Express.js Server Entry Point
// =============================================
// This file sets up the Express application with:
// - CORS (so the React frontend can talk to this server)
// - JSON body parsing (to read JSON data from requests)
// - Morgan (logs every HTTP request for debugging)
// - API routes (organized by feature)
// - Centralized error handling middleware
//
// WHAT'S CHANGED FROM DAY 1?
// --------------------------
// ✅ Converted from CommonJS (require) → ES Modules (import/export)
// ✅ Added morgan for request logging
// ✅ Added upload route (/api/upload)
// ✅ Moved error handler to its own file
// ✅ Added 404 catch-all for undefined routes
//
// ES MODULES vs COMMONJS:
// -----------------------
// CommonJS (old way):  const express = require('express');
// ES Modules (new way): import express from 'express';
//
// ES modules are the modern JavaScript standard. They work in browsers
// too, and most new packages/tutorials use them. We enabled them by
// adding "type": "module" in package.json.
// =============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

// Import our custom modules
import uploadRoutes from './routes/upload.routes.js';
import errorHandler from './middleware/errorHandler.js';

// -------------------------------------------
// Fix for ES Modules: __dirname doesn't exist
// -------------------------------------------
// In CommonJS, Node gives you __dirname and __filename for free.
// In ES modules, you need to derive them manually.
// We need __dirname later if we serve static files.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------
// Load Environment Variables
// -------------------------------------------
// dotenv reads your .env file and makes its values available
// via process.env.VARIABLE_NAME
//
// IMPORTANT: This must run BEFORE you access any process.env values!
// That's why it's at the top of the file.
dotenv.config();

// -------------------------------------------
// Create the Express Application
// -------------------------------------------
const app = express();

// =============================================
// MIDDLEWARE
// =============================================
// Middleware = functions that run BEFORE your route handlers.
// They process the request, add data, check permissions, etc.
// Order matters! They run in the order you define them.

// 1. Morgan — HTTP Request Logger
// --------------------------------
// In development, this prints every request to the terminal:
//   GET /api/health 200 3.456 ms
// "dev" format = method, url, status, response time
// We only enable it in development to keep production logs clean.
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 2. CORS — Cross-Origin Resource Sharing
// -----------------------------------------
// By default, browsers block requests from one domain to another.
// Your React app (localhost:5173) and Express (localhost:5000) are
// different "origins." CORS tells the browser: "It's OK, let them talk."
//
// credentials: true → allows cookies/auth headers to be sent
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// 3. JSON Parser
// ---------------
// Automatically converts JSON request bodies into JavaScript objects.
// Without this: req.body is undefined
// With this: { "text": "hello" } → req.body.text === "hello"
// limit: '50mb' handles large audio data sent as base64
app.use(express.json({ limit: '50mb' }));

// 4. URL-Encoded Parser
// ----------------------
// Handles traditional HTML form submissions (e.g., <form method="POST">)
// extended: true → allows nested objects in form data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =============================================
// API ROUTES
// =============================================

// Health Check — Verify the server is running
// Test it: GET http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '🎙️ SonicScript server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Upload Route — Handle audio file uploads
// Endpoint: POST http://localhost:5000/api/upload
app.use('/api/upload', uploadRoutes);

// Future routes will be added here:
// app.use('/api/transcriptions', transcriptionRoutes);

// =============================================
// 404 HANDLER — Catch undefined routes
// =============================================
// If a request doesn't match any route above, it falls through here.
// This MUST come AFTER all routes but BEFORE the error handler.
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `🔍 Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =============================================
// ERROR HANDLING MIDDLEWARE
// =============================================
// This MUST be the LAST middleware registered.
// It catches errors from all routes and middleware above.
app.use(errorHandler);

// =============================================
// START THE SERVER
// =============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🎙️  SonicScript server is running!`);
  console.log(`📡  http://localhost:${PORT}`);
  console.log(`❤️   Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁  Upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`🔧  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
