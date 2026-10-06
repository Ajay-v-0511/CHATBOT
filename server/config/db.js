const mongoose = require('mongoose');
const config = require('./config');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let isFallbackMode = false;

// Local fallback storage directory
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const connectDB = async () => {
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${config.mongoUri}`);
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    isFallbackMode = false;
    console.log('✅ [DB] Successfully connected to live MongoDB database');
  } catch (err) {
    console.warn(`⚠️ [DB] Could not connect to live MongoDB (${err.message}).`);
    console.warn('⚡ [DB] Initializing resilient file-backed Local Datastore for SmartAssist.');
    isConnected = false;
    isFallbackMode = true;
  }
};

const getDBState = () => ({
  isConnected,
  isFallbackMode,
});

module.exports = {
  connectDB,
  getDBState,
};
