const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI in the environment variables.
 * Called once from server.js at startup.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process — there is no point running without a database
    process.exit(1);
  }
};

module.exports = connectDB;
