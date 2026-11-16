require('dotenv').config();
const mongoose = require('mongoose');

// Import Express application
const app = require('../backend/src/server');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shubham6401:%40Shubham123@cluster0.dwx0kqn.mongodb.net/strologer_db?retryWrites=true&w=majority';

let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    }).then(() => {
      console.log('[Vercel Serverless] Connected to MongoDB Atlas');
    }).catch(err => {
      cachedPromise = null;
      console.error('[Vercel Serverless] DB connection error:', err.message);
      throw err;
    });
  }
  return cachedPromise;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Ensure MongoDB Atlas network access allows 0.0.0.0/0.',
      error: err.message,
    });
  }
  return app(req, res);
};
