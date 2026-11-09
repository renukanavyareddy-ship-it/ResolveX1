const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Ensure cache directory is inside the workspace to avoid permission issues
const cacheDir = path.join(__dirname, '..', '.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}
process.env.MONGOMS_DOWNLOAD_DIR = cacheDir;

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolvex';

  try {
    // Attempt standard connection with 3-second server selection timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(` Standard MongoDB connection to ${uri} failed: ${err.message}`);
    console.log(` Attempting in-memory MongoDB fallback for instant local execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(` In-Memory MongoDB Server started and connected successfully: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(` In-Memory MongoDB fallback failed: ${memErr.message}`);
      console.error(` Please ensure MongoDB is running or specify MONGODB_URI in backend/.env`);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
