// ===========================================
// MongoDB Connection Configuration
// ===========================================
//
// WHAT DOES THIS FILE DO?
// -----------------------
// This file creates a reusable function to connect to MongoDB.
// MongoDB is a NoSQL database — instead of tables and rows (like SQL),
// it stores data as "documents" (like JSON objects) inside "collections."
//
// We use Mongoose, which is an ODM (Object Data Modeling) library.
// Think of Mongoose as a translator between your JavaScript code and MongoDB.
//
// WHEN WILL WE USE THIS?
// ----------------------
// We'll call connectDB() in app.js once you have your MongoDB URI ready
// (either local MongoDB or MongoDB Atlas cloud). For now, it's prepared
// but not yet connected — we'll wire it up on a future day.
//
// COMMON BEGINNER MISTAKES:
// -------------------------
// 1. Forgetting to start MongoDB locally (if using local)
// 2. Using wrong connection string format
// 3. Not whitelisting your IP in MongoDB Atlas
// 4. Committing your MONGODB_URI to GitHub (always use .env!)
// ===========================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error('❌ MONGODB_URI is not defined in your .env file!');
      console.error('   → Copy .env.example to .env and fill in your MongoDB URI');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📦 Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    // Give beginners helpful hints based on common errors
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Hint: Is MongoDB running locally? Try starting it first.');
    }
    if (error.message.includes('authentication')) {
      console.error('   💡 Hint: Check your username and password in MONGODB_URI.');
    }
    if (error.message.includes('network')) {
      console.error('   💡 Hint: Check your internet connection or Atlas IP whitelist.');
    }

    // Exit the process — no point running the server without a database
    process.exit(1);
  }
};

export default connectDB;
