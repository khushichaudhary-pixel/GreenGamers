const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/green_gamers';
    
    // Try connecting to primary MONGO_URI
    mongoose.set('strictQuery', false);
    
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected (Native/Atlas): ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      console.warn(`⚠️ Could not connect to primary MongoDB at ${mongoUri}. Starting embedded in-memory MongoDB server...`);
      
      // Fallback to mongodb-memory-server
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded In-Memory MongoDB Connected: ${memoryUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting DB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
