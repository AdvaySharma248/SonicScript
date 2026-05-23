// =============================================
// SonicScript — Express.js Server Entry Point
// =============================================
// This file sets up the Express application with:
// - CORS (so the React frontend can talk to this server)
// - JSON body parsing (to read JSON data from requests)
// - API routes (organized by feature)
// - Error handling middleware
// =============================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
// This lets us keep secrets (API keys, DB URLs) out of our code
dotenv.config();

// Create the Express application
const app = express();

// ---- Middleware ----
// Middleware = functions that run BEFORE your route handlers

// CORS: Allows the React frontend (localhost:5173) to make requests to this server
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// JSON Parser: Automatically parses JSON request bodies
// Example: When the frontend sends { "text": "hello" }, Express converts it to req.body
app.use(express.json({ limit: '50mb' }));

// URL-Encoded Parser: Handles form data submissions
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---- API Routes ----

// Health Check Route — used to verify the server is running
// Try it: http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '🎙️ SonicScript server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Placeholder for future routes
// app.use('/api/transcriptions', require('./routes/transcription.routes'));
// app.use('/api/upload', require('./routes/upload.routes'));

// ---- Error Handling Middleware ----
// This catches any errors thrown in route handlers
// It MUST have 4 parameters (err, req, res, next) — Express uses this signature to identify error handlers
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// ---- Start the Server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🎙️  SonicScript server is running!`);
  console.log(`📡  http://localhost:${PORT}`);
  console.log(`❤️   Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
