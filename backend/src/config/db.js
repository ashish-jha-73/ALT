const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required and must point to MongoDB Atlas');
  }
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}

module.exports = { connectDB };
